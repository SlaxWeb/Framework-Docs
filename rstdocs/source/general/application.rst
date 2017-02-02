.. SlaxWeb Framework General Topics - Application file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php
.. _Pimple Dependency Injection Container: http://pimple.sensiolabs.org/

.. _gen topics application:

Application object
==================

The Application object is the main object in the SlaxWeb Framework Application.
Through the Application object you access all the services, register providers with
it, access configuration through the configuration service etc.

The Application class implements `ArrayAccess <http://php.net/manual/en/class.arrayaccess.php>`_
and thus the Application class can be used as an Array when dealing with services
or Application parameters.

.. NOTE::
   The Application object extends the `Pimple Dependency Injection Container <http://pimple.sensiolabs.org/>`_.
   Read its documentation as well to get a full understanding on how it works.

Using the Application object
----------------------------

The Application object is automatically injected into multiple parts of the code.
When a Route is executed, an instance of the Application object is injected into
the Route action as an input parameter. Hook definitions also retrieve the Application
object instance as parameters. If Controllers are loaded through its loaders, they
too retrieve an instance of the Application object instance.

The main reason to use the Application object is to retrieve different services
and properties that have been defined in it by Service Providers. You can however
also define your own services and properties in it, as long as you make sure it
is defined before it is used elsewhere in the application.

.. NOTE::
   Controllers do not yet have a loader. **Available in 0.5.0**. Read more about
   loading controllers in :ref:`gen topics controller`.

Writing to Application
``````````````````````

Writing to the Application object is the same as writing an item to an associative
array. You need a key(property/service) name, and a value. Writing the properties
is exactly the same as writing into an array. In the example we are going to write
a property with the name *property* to the Application object::

    // ...
    $application["property"] = "value";
    // ...

The property is now written, and can be accessed at any time. It is not write protected
so, it can be overwritten at a later point in the runtime.

Writing services is just as easy, but comes with more options. There are regular
services, and factories. A service is instantiated only the first time it is called,
all subsequent attempts to read a service from the Application object will return
the previously instantiated object from the service. To write a service to the Application
you need to define a **Closure** and write it to the Application object. The Closure
retrieves an instance of the Application as the input parameter::

    <?php
    use Pimple\Container as Application;

    // ...
    $application["service"] = function (Application $application) {
        return new ServiceClass;
    };
    // ...

As opposed to the service, the factory **Closure** is executed each time the factory
is read from the Application object, and it returns a new object every time. To
define a factory, you also have to define a **Closure** same as with a service,
but you need to call the **factory** method of the Application object with it, and
store the returned value into the Application object::

    <?php
    use Pimple\Container as Application;

    // ...
    $application["service"] = $application->factory(function (Application $application) {
        return new FactoryClass;
    });
    // ...

.. WARNING::
   Take extra care when defining new services, factories, and properties to not
   overwrite any existing items in the Application object. This may lead to unexpected
   behaviour which is hard to debug!

Reading from Application
````````````````````````

To retrieve or read a service or property from the Application object, read from
it as you would from an array. In the example we are presuming that the Application
object is set to the *$application* variable, and we are trying to read a service
with the name *servcie* and a property named *property*::

    // ...
    $service = $application["service"];
    $property = $application["property"];
    // ...

Services
--------

The Framework and all its components save all the services in the Application object
with the **.service** or **.factory** appendixes in the index names. As explained
above, a regular *Service* is instantiated only once, and its defining *Closure*
is called only once. All subsequent calls simply return the result of said *Closure*,
and do not re-call it. Where the *Factory* service is instantiated every time it
is called, and its defining *Closure* is called every time.

Nearly all SlaxWeb Framework components will provide at least some services, through
which you can use them. This is not covered in this part of the documentation, but
rather with each component documentation.

.. _gen topics providers:

Service Providers
-----------------

Service Providers are classes that are used only for defining new services and/or
properties in the Application object. The Service Providers can be registered with
the Framework, and they will be executed and register all the services/properties
that are defined at each request.

Service Provider classes need to be defined in the **app/Providers** directory and
in the **\\App\\Provider** namespace. Furthermore it needs to implement the **\\Pimple\\ServiceProviderInterface**
interface to be a qualified Service Provider Class. As per the interface, the class
needs to define a **register** method. The Register method retrieves Application
object as an input parameter. The **register** method is called when the Service
Provider is registered with the Application object.

Example Service Provider class::

    <?php
    namespace App\Provider;

    use Pimple\Container as Application;

    class MyServiceProvider implements \Pimple\ServiceProviderInterface
    {
        public function register(Application $application)
        {
            $application["service"] = function (Application $application) {
                // ...
                return new ServiceClass;
            };
        }
    }

Registering the Service Provider
````````````````````````````````

The Framework provides a simple way of registering your additional Service Providers
with the Application object. You simply need to add the full class name including
the namespace to the **providerList** configuration array located in the **provider.php**
configuration file::

    <?php
    // ...
    $configuration["providerList"] = [
        // ...
        \App\Provider\MyServiceProvider::class,
        // ...
    ];

The Framework will now instantiate the **MyServiceProvider** class, register it
with the Application object, which will call the **register** method, and register
all the defined *services* and *properties* with the Application, and they will
be ready to use everywhere in your Application where the Application object is available.
