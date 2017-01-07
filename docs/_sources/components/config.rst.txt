.. SlaxWeb Framework Config component documentation file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _config component:

Config Component
================

The Config Component helps you manage configuration of the Framework and your own
application that you are building. It simplifies loading and accessing of the configuration
items through a single interface. The Config Component can load multiple different
types of configurations: **PHP**, **YAML**, and **XML**.

The Config Component is one of the main components of the SlaxWeb Framework, and
is required by it to function properly, as all Framework configuration is handled
by this component. It provides the ability of different kind of configuration handlers
and more can be added to extend the Config Component even further. The **Container**
is the main class of the component, as all interactions with the component are made
directly through the Container. The **Handler** classes are used internally in the
component for parsing the configuration files.

Handler
-------

Provides functionality for retrieval, setting, and removing of config items, as
well as defines an abstract method for loading of config items from a resource,
and parsing them to the internal container.

The Handler class is defined *abstract* and can therefor not be instantiated directly
but must be instantiated through a Handler class that will provide a definition
for the **load** method, that parses the configuration resource and populates the
components Container. It provides the following methods to simplify creation of
additional Config Handlers:

* **get**
* **set**
* **unset**
* **exists**

The *Handler* class also provides **load** method return value constants, that are
used in the specific Handlers:

* **CONFIG_LOADED** - when the configuration is successfully loaded and parsed
* **CONFIG_PARSE_ERROR** - when the configuration is successfully loaded, but an
  error occurred while parsing
* **CONFIG_RESOURCE_NOT_FOUND** - when the configuration resource provided does
  not exist

Prepending configuration item names
```````````````````````````````````

The configuration item key name can be prepended with the base name of the loaded
configuration resource. If the second parameter, *$prependResourceName* is set to
*bool(true)* when calling the **load** method, the load method must prepend the
configuration item with the base name of the resources. Example::

    // load configuration file which contains:
    // $configuration["configname"] = "foo";
    $app["config.service"]->load("myconf.php", true);

    // read the loaded configuration item 'configname':
    $app["config.service"]["myconf.configname"];

Note that the configuration item is now accessed with an additional *myconf.* before
the name of the configuration item.

Specific Handlers
`````````````````

The Config Component already provides the following Handlers:

* **PHP**
* **YAML**
* **XML**

The **PHP** Handler loads and parses PHP configuration files. The PHP configuration
files must contain an array, **$configuration** with that exact name. When the configuration
file is loaded this array is read and all the contents are merged to existing configuration
items.

The **YAML** Handler loads and parses YAML configuration files. There are no limitations
to structuring the YAML configuration files, as the YAML format already dictates
that an entry is comprised of a name and value, where value can be of many types.

The **XML** Handler loads and parses XML configuration files. As with YAML configuration
files, the XML configurations files also hold no restrictions, each entry must have
a key name, the name of the tag, and its value.

Custom Handlers
```````````````

The Config Components allows for a simple creation of custom handlers, this way
configuration items can be loaded from a custom resource. To achieve this, you have
to define a new Handler class that extends the Handler abstract class and provide
at least a **load** method, since this method is used to load the configuration
resource, and parse the configuration items and save them into the **configValues**
protected property of the abstract Handler class.

In order to get the *Custom Handler* working inside the Framework, the **configHandler.service**
service definition has to be extended. The extension should instantiate the *Custom
Handler* and return an instance of it.

Example *Custom Handler*, **CustomHandler.php**::

    <?php
    namespace App\Library\MyConfig;

    use SlaxWeb\Config\Handler;

    class CustomHandler extends Handler
    {
        public function load(string $config, bool $prependResourceName = false)
        {
            // ... custom implementation ...
            return Handler::CONFIG_LOADED;
        }
    }

Extending the **configHandler.service**::

    <?php
    namespace App\Provider;

    class Sample implements \Pimple\ServiceProviderInterface
    {
        public function register(\Pimple\Container $app)
        {
            $app->extend("configHandler.service", function ($handler, ))
        }
    }
