from django.urls import path

from . import views


urlpatterns = [

    # ==========================
    # HOME
    # ==========================

    path(
        '',
        views.home,
        name='home'
    ),


    # ==========================
    # DASHBOARD
    # ==========================

    path(
        'dashboard/',
        views.dashboard,
        name='dashboard'
    ),


    # ==========================
    # DATA STRUCTURES
    # ==========================

    path(
        'data-structures/',
        views.data_structures,
        name='data_structures'
    ),


    # ==========================
    # STACK
    # ==========================

    path(
        'stack/',
        views.stack,
        name='stack'
    ),


    # ==========================
    # QUEUE
    # ==========================

    path(
        'queue/',
        views.queue,
        name='queue'
    ),


    # ==========================
    # SINGLY LINKED LIST
    # ==========================

    path(
        'singly-linked-list/',
        views.singly_linked_list,
        name='singly_linked_list'
    ),

    path(
        'singly-linked-list/visualization/',
        views.sll_visualization,
        name='sll_visualization'
    ),


    # ==========================
    # DOUBLY LINKED LIST
    # ==========================

    path(
        'doubly-linked-list/',
        views.doubly_linked_list,
        name='doubly_linked_list'
    ),

    path(
        'doubly-linked-list/visualization/',
        views.dll_visualization,
        name='dll_visualization'
    ),


    # ==========================
    # SEARCHING
    # ==========================

    path(
        'searching/',
        views.searching,
        name='searching'
    ),

    path(
        'searching/visualization/',
        views.searching_visualization,
        name='searching_visualization'
    ),


    # =====================================
    # SORTING
    # =====================================

    path(
        'sorting/',
        views.sorting,
        name='sorting'
    ),


    # =====================================
    # BUBBLE SORT
    # =====================================

    path(
        'sorting/bubble-sort/',
        views.bubble_sort,
        name='bubble_sort'
    ),

    path(
        'sorting/bubble-sort/visualization/',
        views.bubble_sort_visualization,
        name='bubble_sort_visualization'
    ),


    # =====================================
    # SELECTION SORT
    # =====================================

    path(
        'sorting/selection-sort/',
        views.selection_sort,
        name='selection_sort'
    ),

    path(
        'sorting/selection-sort/visualization/',
        views.selection_sort_visualization,
        name='selection_sort_visualization'
    ),


    # =====================================
    # INSERTION SORT
    # =====================================

    path(
        'sorting/insertion-sort/',
        views.insertion_sort,
        name='insertion_sort'
    ),

    path(
        'sorting/insertion-sort/visualization/',
        views.insertion_sort_visualization,
        name='insertion_sort_visualization'
    ),


    # =====================================
    # MERGE SORT
    # =====================================

    path(
        'sorting/merge-sort/',
        views.merge_sort,
        name='merge_sort'
    ),

    path(
        'sorting/merge-sort/visualization/',
        views.merge_sort_visualization,
        name='merge_sort_visualization'
    ),


    # =====================================
    # QUICK SORT
    # =====================================

    path(
        'sorting/quick-sort/',
        views.quick_sort,
        name='quick_sort'
    ),

    path(
        'sorting/quick-sort/visualization/',
        views.quick_sort_visualization,
        name='quick_sort_visualization'
    ),


    # =====================================
    # TREE
    # =====================================

    path(
        'tree/',
        views.tree,
        name='tree'
    ),


    # =====================================
    # BINARY SEARCH TREE
    # =====================================

    path(
        'tree/bst/visualization/',
        views.bst_visualization,
        name='bst_visualization'
    ),


    # =====================================
    # TREE TRAVERSAL
    # =====================================

    path(
        'tree/traversal/visualization/',
        views.traversal_visualization,
        name='traversal_visualization'
    ),


    # =====================================
    # B TREE
    # =====================================

    path(
        'tree/b-tree/visualization/',
        views.b_tree_visualization,
        name='b_tree_visualization'
    ),


    # =====================================
    # B+ TREE
    # =====================================

    path(
        'tree/b-plus-tree/visualization/',
        views.b_plus_tree_visualization,
        name='b_plus_tree_visualization'
    ),


    # =====================================
    # CODE EXECUTION
    # =====================================

    path(
        'run-code/',
        views.run_code,
        name='run_code'
    ),


    # =====================================
    # AUTHENTICATION
    # =====================================

    path(
        'api/register/',
        views.register_view,
        name='register'
    ),

    path(
        'api/login/',
        views.login_view,
        name='login'
    ),

    path(
        'api/logout/',
        views.logout_view,
        name='logout'
    ),

    path(
        'api/current-user/',
        views.current_user_view,
        name='current-user'
    ),

    path(
    'run-code/',
    views.run_code,
    name='run_code'
)
]