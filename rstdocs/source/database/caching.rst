.. SlaxWeb Framework Database - Caching file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _database caching:

Query Caching
=============

Query caching is done simply with the help of the Cache Base Model that extends
from the :ref:`database basemodel` class, and thus providing all the same functionality
and more in terms of caching. But before the Cache Base Model can be extended the
:ref:`gen topics cache` component must be installed, along with the **cache-database**
sub-component.

When all the requirements have been met, simply extend all the models that will
be using the cache from the **\\SlaxWeb\\Cache\\Database\\Model** class.

Using the model
---------------

The model is used as any other model, everything is handled automatically. When
you select data from the database, the Cache Model will calculate a hash from the
*WHERE* statement and the column list, and save the retrieved **Result** object
with in the cache, and simply retrieve that same **Result** object from it, if it
is not expired.

The full name of the data is, **database_<tableName><customCacheName>_<hash>**.

Where:

* **tableName** is the name of the table in use by the model
* **customCacheName** is the custom name for the data that can be set with the **setCacheName**
* **hash** is the above calculated cache from the *WHERE* statement and the column list

Example::

    <?php
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel->where("id", 1)->select(["text"]); // will execute the query and store it to cache
    // code ...

    // diferent area in the code or a consecutive run:
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel->where("id", 1)->select(["text"]); // will obtain data from cache without querying the database
    // code ...

Custom cache name
-----------------

If a custom cache name is set with the **setCacheName** method, or to the **$cacheName**
protected property directly, then the Cache Model will include it in the name of
the cached data, for simplified removal later.

Automatic removal on update
'''''''''''''''''''''''''''

The Cache Base Model also automatically removes cached data on an **update** call
if a custom cache name was set, but it will remove all the data stored with that
particular custom cache name, for that model.

Example::

    <?php
    // user loads the page to view a forum post
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel
        ->setCacheName("post_id_1")
        ->where("id", 1)
        ->select(["text"]); // will execute the query and store it to cache
    // code ...

    // user edits the post
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel
        ->setCacheName("post_id_1")
        ->where("id", 1)
        ->update(["text" => "fixed post text"]); // will remove old cached data and update the data in the database
    // code ...

    // user loads the page to view a forum post again
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel
        ->setCacheName("post_id_1")
        ->where("id", 1)
        ->select(["text"]); // will execute the query and store it to cache
    // code ...

Skipping cache
--------------

To skip caching the obtained data, or reading from the cache, even if the data exists
the Cache Model provides a **skipCache** method that will disable cache for the
next **select** call::

    <?php
    // code ...
    $postModel = $app["loadDBModel.service"]("Post");
    $postModel
        ->skipCache()
        ->where("id", 1)
        ->select(["text"]); // will obtain data from database and not store it to cache
    // code ...
