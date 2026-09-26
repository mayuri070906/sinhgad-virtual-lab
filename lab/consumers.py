import asyncio
import json
import os
import shutil
import subprocess
import sys
import tempfile
import threading

from channels.generic.websocket import AsyncWebsocketConsumer


class CodeExecutionConsumer(AsyncWebsocketConsumer):

    MAX_RUNTIME = 30

    async def connect(self):
        self.process = None
        self.temp_dir = None
        self.closed = False
        self.loop = asyncio.get_running_loop()

        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "connected"
        }))

    async def disconnect(self, close_code):
        self.closed = True

        if self.process is not None:
            await asyncio.to_thread(
                self._terminate_process,
                self.process
            )

        self.process = None

        self._cleanup_temp_dir()

    async def receive(self, text_data=None, bytes_data=None):

        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error("Invalid WebSocket message.")
            return

        message_type = data.get("type")

        # ==============================
        # RUN PROGRAM
        # ==============================

        if message_type == "run":

            code = data.get("code", "")
            language = data.get("language", "c")

            await self.run_program(
                code,
                language
            )

        # ==============================
        # SEND USER INPUT
        # ==============================

        elif message_type == "input":

            user_input = data.get("input", "")

            await self.send_input(
                user_input
            )

        # ==============================
        # STOP PROGRAM
        # ==============================

        elif message_type == "stop":

            await self.stop_program()

    # =====================================================
    # RUN PROGRAM
    # =====================================================

    async def run_program(self, code, language):

        # Stop previous program if running
        if self.process is not None:

            await asyncio.to_thread(
                self._terminate_process,
                self.process
            )

            self.process = None

        self._cleanup_temp_dir()

        if not code.strip():

            await self.send_error(
                "Please write some code first."
            )

            return

        try:

            self.temp_dir = tempfile.mkdtemp(
                prefix="virtual_lab_"
            )

            command = await asyncio.to_thread(
                self._prepare_program,
                code,
                language,
                self.temp_dir
            )

            self.process = subprocess.Popen(

                command,

                cwd=self.temp_dir,

                stdin=subprocess.PIPE,

                stdout=subprocess.PIPE,

                stderr=subprocess.STDOUT,

                text=True,

                encoding="utf-8",

                errors="replace",

                bufsize=1,

                universal_newlines=True,

                shell=False
            )

            process = self.process

            await self.send(
                text_data=json.dumps({
                    "type": "started"
                })
            )

            # ------------------------------------------
            # Output reader thread
            # ------------------------------------------

            output_thread = threading.Thread(

                target=self._read_output,

                args=(
                    process,
                    self.loop
                ),

                daemon=True
            )

            output_thread.start()

            # ------------------------------------------
            # Timeout watcher
            # ------------------------------------------

            timeout_thread = threading.Thread(

                target=self._watch_process,

                args=(
                    process,
                    self.loop
                ),

                daemon=True
            )

            timeout_thread.start()

        except Exception as error:

            self.process = None

            self._cleanup_temp_dir()

            await self.send_error(
                str(error)
            )

    # =====================================================
    # PREPARE / COMPILE PROGRAM
    # =====================================================

    def _prepare_program(
        self,
        code,
        language,
        temp_dir
    ):

        language = language.lower()

        # =================================================
        # C
        # =================================================

        if language == "c":

            source_file = os.path.join(
                temp_dir,
                "main.c"
            )

            executable = os.path.join(
                temp_dir,
                "main.exe"
            )

            with open(
                source_file,
                "w",
                encoding="utf-8"
            ) as file:

                file.write(code)

            result = subprocess.run(

                [
                    "gcc",
                    source_file,
                    "-o",
                    executable
                ],

                cwd=temp_dir,

                capture_output=True,

                text=True,

                encoding="utf-8",

                errors="replace",

                timeout=10
            )

            if result.returncode != 0:

                error = (
                    result.stderr
                    or result.stdout
                    or "C compilation failed."
                )

                raise RuntimeError(error)

            return [executable]

        # =================================================
        # C++
        # =================================================

        if language == "cpp":

            source_file = os.path.join(
                temp_dir,
                "main.cpp"
            )

            executable = os.path.join(
                temp_dir,
                "main.exe"
            )

            with open(
                source_file,
                "w",
                encoding="utf-8"
            ) as file:

                file.write(code)

            result = subprocess.run(

                [
                    "g++",
                    source_file,
                    "-o",
                    executable
                ],

                cwd=temp_dir,

                capture_output=True,

                text=True,

                encoding="utf-8",

                errors="replace",

                timeout=10
            )

            if result.returncode != 0:

                error = (
                    result.stderr
                    or result.stdout
                    or "C++ compilation failed."
                )

                raise RuntimeError(error)

            return [executable]

        # =================================================
        # JAVA
        # =================================================

        if language == "java":

            source_file = os.path.join(
                temp_dir,
                "Main.java"
            )

            with open(
                source_file,
                "w",
                encoding="utf-8"
            ) as file:

                file.write(code)

            result = subprocess.run(

                [
                    "javac",
                    source_file
                ],

                cwd=temp_dir,

                capture_output=True,

                text=True,

                encoding="utf-8",

                errors="replace",

                timeout=10
            )

            if result.returncode != 0:

                error = (
                    result.stderr
                    or result.stdout
                    or "Java compilation failed."
                )

                raise RuntimeError(error)

            return [
                "java",
                "-cp",
                temp_dir,
                "Main"
            ]

        # =================================================
        # PYTHON
        # =================================================

        if language == "python":

            source_file = os.path.join(
                temp_dir,
                "main.py"
            )

            with open(
                source_file,
                "w",
                encoding="utf-8"
            ) as file:

                file.write(code)

            return [
                sys.executable,
                "-u",
                source_file
            ]

        # =================================================
        # INVALID LANGUAGE
        # =================================================

        raise RuntimeError(
            f"Unsupported language: {language}"
        )

    # =====================================================
    # READ PROGRAM OUTPUT
    # =====================================================

    def _read_output(
        self,
        process,
        loop
    ):

        try:

            while True:

                character = process.stdout.read(1)

                if character == "":
                    break

                if self.closed:
                    break

                message = json.dumps({
                    "type": "output",
                    "data": character
                })

                try:

                    future = asyncio.run_coroutine_threadsafe(

                        self.send(
                            text_data=message
                        ),

                        loop
                    )

                    future.result(
                        timeout=2
                    )

                except Exception:

                    break

        except Exception as error:

            if not self.closed:

                try:

                    message = json.dumps({
                        "type": "error",
                        "data": str(error)
                    })

                    asyncio.run_coroutine_threadsafe(

                        self.send(
                            text_data=message
                        ),

                        loop
                    )

                except Exception:
                    pass

        finally:

            try:

                return_code = process.wait(
                    timeout=2
                )

            except Exception:

                return_code = -1

            if not self.closed:

                try:

                    asyncio.run_coroutine_threadsafe(

                        self.process_finished(
                            return_code
                        ),

                        loop
                    )

                except Exception:

                    pass

    # =====================================================
    # PROCESS FINISHED
    # =====================================================

    async def process_finished(
        self,
        return_code
    ):

        if self.closed:
            return

        self.process = None

        await self.send(
            text_data=json.dumps({
                "type": "done",
                "return_code": return_code
            })
        )

        self._cleanup_temp_dir()

    # =====================================================
    # SEND INPUT TO PROGRAM
    # =====================================================

    async def send_input(
        self,
        user_input
    ):

        process = self.process

        if process is None:

            return

        if process.poll() is not None:

            return

        try:

            await asyncio.to_thread(
                self._write_input,
                process,
                user_input
            )

        except Exception as error:

            await self.send_error(
                str(error)
            )

    # =====================================================
    # WRITE INPUT
    # =====================================================

    def _write_input(
        self,
        process,
        user_input
    ):

        if process.stdin is None:
            return

        process.stdin.write(
            user_input
        )

        process.stdin.flush()

    # =====================================================
    # STOP PROGRAM
    # =====================================================

    async def stop_program(self):

        process = self.process

        if process is None:
            return

        await asyncio.to_thread(
            self._terminate_process,
            process
        )

        self.process = None

        self._cleanup_temp_dir()

    # =====================================================
    # TERMINATE PROCESS
    # =====================================================

    def _terminate_process(
        self,
        process
    ):

        try:

            if process.stdin:

                try:
                    process.stdin.close()
                except Exception:
                    pass

            if process.poll() is None:

                process.terminate()

                try:

                    process.wait(
                        timeout=2
                    )

                except subprocess.TimeoutExpired:

                    process.kill()

                    try:
                        process.wait(
                            timeout=2
                        )
                    except Exception:
                        pass

        except Exception:
            pass

    # =====================================================
    # WATCH PROCESS TIMEOUT
    # =====================================================

    def _watch_process(
        self,
        process,
        loop
    ):

        try:

            process.wait(
                timeout=self.MAX_RUNTIME
            )

        except subprocess.TimeoutExpired:

            if self.closed:
                return

            try:

                asyncio.run_coroutine_threadsafe(

                    self.timeout_process(
                        process
                    ),

                    loop
                )

            except Exception:
                pass

    # =====================================================
    # TIMEOUT
    # =====================================================

    async def timeout_process(
        self,
        process
    ):

        if self.process is not process:
            return

        await asyncio.to_thread(
            self._terminate_process,
            process
        )

        self.process = None

        await self.send(
            text_data=json.dumps({
                "type": "error",
                "data": (
                    "\n\nProgram stopped: "
                    "30 second execution limit reached."
                )
            })
        )

        self._cleanup_temp_dir()

    # =====================================================
    # ERROR MESSAGE
    # =====================================================

    async def send_error(
        self,
        message
    ):

        if self.closed:
            return

        await self.send(
            text_data=json.dumps({
                "type": "error",
                "data": message
            })
        )

    # =====================================================
    # CLEAN TEMP DIRECTORY
    # =====================================================

    def _cleanup_temp_dir(self):

        if not self.temp_dir:
            return

        directory = self.temp_dir

        self.temp_dir = None

        try:

            if os.path.exists(directory):

                shutil.rmtree(
                    directory,
                    ignore_errors=True
                )

        except Exception:
            pass