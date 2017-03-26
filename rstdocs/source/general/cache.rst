.. SlaxWeb Framework General Topics - Cache file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics cache:

Cache
=====

The Cache component offers caching capabilities for utilisation in your application.
The component helps with simple storing and retrieval of data from the cache, with
possibilities to swap out caching storages almost painlessly, as well as it provides
options to write further extensions for caching storages that are not supported
by the Cache component. Along with that, sub-components are provided that help with
caching of specific parts of your application almost transparently, like caching
queries or views.

The Cache component is not a core component and must thus be installed with the
:ref:`gen topics slaxer` command line tool::

    ./slaxwe component:install cache

.. NOTE::

   At this moment only the Database Cache sub-component is available. The View/Template
   Cache sub-component is planed for future relases.

Configuration
-------------

The Cache component comes with a **cache.php** configuration file. The following
settings can be configured there:

handler
'''''''

* Data type: **string**
* Default: **file**

The cache handler used by the cache component to store the data. The following handlers
are provided:

* file
* memcached
* redis

.. NOTE::
   At the moment only the 'file' handler is available. Other handlers are planned
   for future releases.

location
''''''''
* Data type: **string**
* Default: **__DIR__/../Cache/**

The location depends on the handler. For **file** handler it is the absolute path
to the directory where the Cache component may write to.

maxAge
''''''

* Data type: **int**
* Default: **3600**

Maximum age for data in the cache. This value is used as default for all data stored
in the cache, but can be overridden for each one specifically. Maximum age is defined
in seconds with a default value of int(3600), equivalent for one hour. If the maximum
age is set to int(0), then the data will never expire.

Using the cache
---------------

The cache component is available under the **cache.service** name in the service
container, and is obtainable like any other service::

   <?php
   // code ...
   $cache = $app["cache.service"];
   // code ...

When the cache service is retrieved it is also instantiated, along with its handler.
If an instantiation error occurs with the handler, it will throw an exception at
this point.

Write and read
--------------

All operations on the cache are done directly on the main cache object returned
from the **cache.service**. It provides simple methods to **write**, **read**, and
**remove** from cache.

All entries require a unique string name for the cache. In case of the file storage
it needs to be a valid filesystem name. Through this name, the data is also retrieved
or removed from the cache.

write
'''''

The **write** method takes the name of the data to cache as the first parameter,
the second parameter holds the actual data. This data may be anything, as the manager
will serialize the data before storing.

The third, and final parameter is optional and may override the default configured
maximum age for the data. The value is in seconds, any negative value will use the
default configured maximum age from the **cache.php** configuration file, a int(0)
value will keep the data in the cache indefinitely, unless removed manually.

Example usage::

   <?php
   // code ...
   $foo = new Foo;
   $foo->bar = "baz";
   $cache = $app["cache.service"];
   $cache->write("myFooObject", $foo, 0);
   // code ...

read
''''

The **read** method takes only the name of the cached data as the parameter, and
tries to obtain it from the cache. It may throw an **\\SlaxWeb\\Cache\\Exception\\CacheDataNotFoundException**
if the data is not found, or the **\\SlaxWeb\\Cache\\Exception\\CacheDataExpiredException**
if the data has already expired, or the **\\SlaxWeb\\Cache\\Exception\\CacheDataInvalidException**
if the data in the cache is no unserializable, which should happen only if the cache
was manually manipulated with. All the exceptions extend from the **\\SlaxWeb\\Cache\\Exception\\CacheException**
class.

The **read** method will return the unserialized data, and may therefore be of different types.
Example usage::

   <?php
   // code ...
   $cache = $app["cache.service"];
   $foo = $cache->read("myFooObject");
   echo $foo->bar; // will output "baz"
   // code ...

remove
''''''

The **remove** method takes the full or partial name of the cached data, and a *partial*
flag as the second parameter. If the *partial* flag is set to true, then all the
data that contains the input *name* in its name is removed.

Example usage::

   <?php
   // code ...
   $cache = $app["cache.service"];
   $cache->remove("myFooObject");
   $cache->remove("Foo", true); // would remove "myFooObject" as well since it contains "Foo"
   // code ...
