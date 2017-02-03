.. SlaxWeb Framework General Topics - Libraries file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics libraries:

Libraries
=========

Libraries are a collection of classes bundled together in one package to serve a
purpose or to provide extended functionality to your application. They can be either
written by yourself, or by someone else.

The Framework provides a directory, **app/Library/** and a namespace **\\App\\Library**,
for you to store those libraries. You can also use the :ref:`Composer <https://getcomposer.org/>`_
tool to install 3rd party libraries, and they will by default be installed into the
**vendor/** directory.

Registering libraries
---------------------

How you will use the installed or written library is up to you, but we recommend
you expose it to the application as a service. To do so, you need to write a service
provider class. To write a service provider save it to the **app/Provider/** directory
and give it the namespace of **\\App\\Provider**, in our example we will create a
**MyProvider.php** file in the above example::

    <?php
    namespace App\Provider;

    use Pimple\Container as App;

    class MyProvider implements \Pimple\ServiceProviderInterface
    {
        public function register(App $app)
        {
        }
    }

The basic service provider class layout is set, but it is not yet registered with
the Framework. To do so, add the full class name to the **providerList** configuration
item in **app/Config/provider.php** configuration file::

    <?php
    // ...
    $configuration["providerList"] = [
        \App\Provider\MyProvider::class
    ];
    // ...

All there is to it now, is to expose the library to the application as service.
To do so, give it a unique name, in this example we use **mylibrary.service** as
the service name for the example library. To expose it, we add a initialisation
function to the *$app* variable in the *register* method in the provider class::

    <?php
    // ...
        public function register(App $app)
        {
            $app["mylibrary.service"] = function(App $app) {
                return new \App\Library\MyLibrary;
            };
        }
    // ...

As seen above, the initialisation function retrieves the :ref:`gen topics application`
as input. The initialisation function must return the library object at the end,
as this object will be retrieved by the caller later. To use the library, you call
it as any other service wherever you need it in the application::

    <?php
    // ...
    $library = $application["mylibrary.service"];
    // ...

For more information on registering services and service providers, please refer
to the `Pimple Dependency Injection Container Documentation <http://pimple.sensiolabs.org/>`_.
