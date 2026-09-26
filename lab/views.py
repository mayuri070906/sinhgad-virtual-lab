from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

import subprocess
import tempfile
import os
import sys


# ==========================================================
# AUTHENTICATION
# ==========================================================

@csrf_exempt
def register_view(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "error": "POST method required."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        password2 = data.get("password2", "")

        # ------------------------------------------
        # Required fields check
        # ------------------------------------------

        if not username or not email or not password:
            return JsonResponse(
                {
                    "success": False,
                    "error": "All fields are required."
                },
                status=400
            )

        # ------------------------------------------
        # Password confirmation
        # ------------------------------------------

        if password != password2:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Passwords do not match."
                },
                status=400
            )

        # ------------------------------------------
        # Username already exists
        # ------------------------------------------

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {
                    "success": False,
                    "error": "Username already exists."
                },
                status=400
            )

        # ------------------------------------------
        # Create user
        # ------------------------------------------

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # ------------------------------------------
        # Login immediately after registration
        # ------------------------------------------

        login(request, user)

        return JsonResponse(
            {
                "success": True,
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "error": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "error": str(e)
            },
            status=400
        )


# ==========================================================
# LOGIN
# ==========================================================

@csrf_exempt
def login_view(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "error": "POST method required"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Username and password are required"
                },
                status=400
            )

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Invalid username or password"
                },
                status=401
            )

        login(request, user)

        return JsonResponse(
            {
                "success": True,
                "message": "Login successful",
                "user": {
                    "username": user.username,
                    "email": user.email
                },
                "username": user.username,
                "is_authenticated": True
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "error": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "error": str(e)
            },
            status=400
        )


# ==========================================================
# LOGOUT
# ==========================================================

@csrf_exempt
def logout_view(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "error": "POST method required"
            },
            status=405
        )

    logout(request)

    return JsonResponse(
        {
            "success": True,
            "message": "Logout successful",
            "is_authenticated": False
        }
    )


# ==========================================================
# CURRENT USER
# ==========================================================

def current_user_view(request):

    if not request.user.is_authenticated:

        return JsonResponse(
            {
                "success": False,
                "is_authenticated": False
            },
            status=401
        )

    return JsonResponse(
        {
            "success": True,
            "is_authenticated": True,
            "username": request.user.username,
            "email": request.user.email,
            "user": {
                "username": request.user.username,
                "email": request.user.email
            }
        }
    )


# ==========================================================
# HOME PAGE
# ==========================================================

def home(request):
    return render(
        request,
        'lab/home.html'
    )


# ==========================================================
# DASHBOARD
# ==========================================================

def dashboard(request):
    return render(
        request,
        'lab/dashboard.html'
    )


# ==========================================================
# DATA STRUCTURES
# ==========================================================

def data_structures(request):
    return render(
        request,
        'lab/data_structures.html'
    )


# ==========================================================
# STACK
# ==========================================================

def stack(request):
    return render(
        request,
        'lab/stack.html'
    )


# ==========================================================
# QUEUE
# ==========================================================

def queue(request):
    return render(
        request,
        'lab/queue.html'
    )


# ==========================================================
# SINGLY LINKED LIST
# ==========================================================

def singly_linked_list(request):
    return render(
        request,
        'lab/singly_linked_list.html'
    )


def sll_visualization(request):
    return render(
        request,
        'lab/sll_visualization.html'
    )


# ==========================================================
# DOUBLY LINKED LIST
# ==========================================================

def doubly_linked_list(request):
    return render(
        request,
        'lab/doubly_linked_list.html'
    )


def dll_visualization(request):
    return render(
        request,
        'lab/dll_visualization.html'
    )


# ==========================================================
# SEARCHING
# ==========================================================

def searching(request):
    return render(
        request,
        'lab/searching.html'
    )


def searching_visualization(request):
    return render(
        request,
        'lab/searching_visualization.html'
    )


# ==========================================================
# SORTING MAIN PAGE
# ==========================================================

def sorting(request):
    return render(
        request,
        'lab/sorting.html'
    )


# ==========================================================
# BUBBLE SORT
# ==========================================================

def bubble_sort(request):
    return render(
        request,
        'lab/bubble_sort.html'
    )


def bubble_sort_visualization(request):
    return render(
        request,
        'lab/bubble_sort_visualization.html'
    )


# ==========================================================
# SELECTION SORT
# ==========================================================

def selection_sort(request):
    return render(
        request,
        'lab/selection_sort.html'
    )


def selection_sort_visualization(request):
    return render(
        request,
        'lab/selection_sort_visualization.html'
    )


# ==========================================================
# INSERTION SORT
# ==========================================================

def insertion_sort(request):
    return render(
        request,
        'lab/insertion_sort.html'
    )


def insertion_sort_visualization(request):
    return render(
        request,
        'lab/insertion_sort_visualization.html'
    )


# ==========================================================
# MERGE SORT
# ==========================================================

def merge_sort(request):
    return render(
        request,
        'lab/merge_sort.html'
    )


def merge_sort_visualization(request):
    return render(
        request,
        'lab/merge_sort_visualization.html'
    )


# ==========================================================
# QUICK SORT
# ==========================================================

def quick_sort(request):
    return render(
        request,
        'lab/quick_sort.html'
    )


def quick_sort_visualization(request):
    return render(
        request,
        'lab/quick_sort_visualization.html'
    )


# ==========================================================
# TREE
# ==========================================================

def tree(request):
    return render(
        request,
        'lab/tree.html'
    )


# ==========================================================
# BINARY SEARCH TREE
# ==========================================================

def bst_visualization(request):
    return render(
        request,
        'lab/bst_visualization.html'
    )


# ==========================================================
# TREE TRAVERSAL
# ==========================================================

def traversal_visualization(request):
    return render(
        request,
        'lab/traversal_visualization.html'
    )


# ==========================================================
# B TREE
# ==========================================================

def b_tree_visualization(request):
    return render(
        request,
        'lab/b_tree_visualization.html'
    )


# ==========================================================
# B+ TREE
# ==========================================================

def b_plus_tree_visualization(request):
    return render(
        request,
        'lab/b_plus_tree_visualization.html'
    )


# ==========================================================
# CODE EXECUTION
# ==========================================================

@csrf_exempt
def run_code(request):

    # Only POST request allowed
    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "output": "Only POST request is allowed."
            },
            status=405
        )

    try:

        # ------------------------------------------
        # Get data from React Code Editor
        # ------------------------------------------

        code = request.POST.get("code", "")
        language = request.POST.get("language", "c")

        # Input box madhla data ithe receive hoto
        user_input = request.POST.get("input", "")


        # ------------------------------------------
        # Empty code check
        # ------------------------------------------

        if not code.strip():

            return JsonResponse(
                {
                    "success": False,
                    "output": "Please write some code first."
                }
            )


        # ------------------------------------------
        # Temporary folder
        # ------------------------------------------

        with tempfile.TemporaryDirectory() as temp_dir:


            # ==================================================
            # C
            # ==================================================

            if language == "c":

                source_file = os.path.join(
                    temp_dir,
                    "main.c"
                )

                exe_file = os.path.join(
                    temp_dir,
                    "main.exe"
                )


                # Save C code
                with open(
                    source_file,
                    "w",
                    encoding="utf-8"
                ) as f:

                    f.write(code)


                # ------------------------------------------
                # Compile C
                # ------------------------------------------

                compile_result = subprocess.run(
                    [
                        "gcc",
                        source_file,
                        "-o",
                        exe_file
                    ],
                    capture_output=True,
                    text=True,
                    timeout=10
                )


                # Compilation error
                if compile_result.returncode != 0:

                    return JsonResponse(
                        {
                            "success": False,
                            "output": compile_result.stderr
                        }
                    )


                # ------------------------------------------
                # Run C program
                # ------------------------------------------

                run_result = subprocess.run(
                    [exe_file],
                    input=user_input,
                    capture_output=True,
                    text=True,
                    timeout=5
                )


                output = run_result.stdout


                if run_result.stderr:

                    output += "\n" + run_result.stderr


                return JsonResponse(
                    {
                        "success": True,
                        "output": output
                    }
                )


            # ==================================================
            # C++
            # ==================================================

            elif language == "cpp":

                source_file = os.path.join(
                    temp_dir,
                    "main.cpp"
                )

                exe_file = os.path.join(
                    temp_dir,
                    "main.exe"
                )


                # Save C++ code
                with open(
                    source_file,
                    "w",
                    encoding="utf-8"
                ) as f:

                    f.write(code)


                # ------------------------------------------
                # Compile C++
                # ------------------------------------------

                compile_result = subprocess.run(
                    [
                        "g++",
                        source_file,
                        "-o",
                        exe_file
                    ],
                    capture_output=True,
                    text=True,
                    timeout=10
                )


                # Compilation error
                if compile_result.returncode != 0:

                    return JsonResponse(
                        {
                            "success": False,
                            "output": compile_result.stderr
                        }
                    )


                # ------------------------------------------
                # Run C++ program
                # ------------------------------------------

                run_result = subprocess.run(
                    [exe_file],
                    input=user_input,
                    capture_output=True,
                    text=True,
                    timeout=5
                )


                output = run_result.stdout


                if run_result.stderr:

                    output += "\n" + run_result.stderr


                return JsonResponse(
                    {
                        "success": True,
                        "output": output
                    }
                )


            # ==================================================
            # JAVA
            # ==================================================

            elif language == "java":

                source_file = os.path.join(
                    temp_dir,
                    "Main.java"
                )


                # Save Java code
                with open(
                    source_file,
                    "w",
                    encoding="utf-8"
                ) as f:

                    f.write(code)


                # ------------------------------------------
                # Compile Java
                # ------------------------------------------

                compile_result = subprocess.run(
                    [
                        "javac",
                        source_file
                    ],
                    capture_output=True,
                    text=True,
                    timeout=10
                )


                # Compilation error
                if compile_result.returncode != 0:

                    return JsonResponse(
                        {
                            "success": False,
                            "output": compile_result.stderr
                        }
                    )


                # ------------------------------------------
                # Run Java program
                # ------------------------------------------

                run_result = subprocess.run(
                    [
                        "java",
                        "-cp",
                        temp_dir,
                        "Main"
                    ],
                    input=user_input,
                    capture_output=True,
                    text=True,
                    timeout=5
                )


                output = run_result.stdout


                if run_result.stderr:

                    output += "\n" + run_result.stderr


                return JsonResponse(
                    {
                        "success": True,
                        "output": output
                    }
                )


            # ==================================================
            # PYTHON
            # ==================================================

            elif language == "python":

                source_file = os.path.join(
                    temp_dir,
                    "main.py"
                )


                # Save Python code
                with open(
                    source_file,
                    "w",
                    encoding="utf-8"
                ) as f:

                    f.write(code)


                # ------------------------------------------
                # Run Python program
                # ------------------------------------------

                run_result = subprocess.run(
                    [
                        sys.executable,
                        source_file
                    ],
                    input=user_input,
                    capture_output=True,
                    text=True,
                    timeout=5
                )


                output = run_result.stdout


                if run_result.stderr:

                    output += "\n" + run_result.stderr


                return JsonResponse(
                    {
                        "success": True,
                        "output": output
                    }
                )


            # ==================================================
            # INVALID LANGUAGE
            # ==================================================

            else:

                return JsonResponse(
                    {
                        "success": False,
                        "output": "Unsupported language."
                    }
                )


    # ==========================================================
    # TIMEOUT ERROR
    # ==========================================================

    except subprocess.TimeoutExpired:

        return JsonResponse(
            {
                "success": False,
                "output": (
                    "Execution timed out. "
                    "Please check your code."
                )
            }
        )


    # ==========================================================
    # COMPILER NOT FOUND
    # ==========================================================

    except FileNotFoundError as e:

        return JsonResponse(
            {
                "success": False,
                "output": (
                    f"Compiler/interpreter not found: {str(e)}"
                )
            }
        )


    # ==========================================================
    # OTHER ERROR
    # ==========================================================

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "output": f"Error: {str(e)}"
            }
        )