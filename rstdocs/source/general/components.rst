.. SlaxWeb Framework General Topics - Components file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: javascript

.. _gen topics components:

Components
==========

The SlaxWeb Framework is composed with many different components. A Framework component
is basically a small part of the Framework. Some components are essentials for the
Framework to function, like a *Router*, while it can function just fine without some
of the components, like a *Session* component. The clean installation of the Framework
already includes the following uninstallable components:

* Bootstrap
* Config
* Logger
* Hooks
* Router
* Slaxer

While this is enough to get started with application development, there are other
components available to simplify tasks, like handling *sessions*, *database* operations,
*templating*, and so on. The Framework is broken down into components to allow for
a cleaner environment, and to provide maximum flexibility to the developer in allowing
him/her the freedom to use whatever they see fit.

All components are installable by hand, or through the :ref:`gen topics slaxer`
command line tool. However, installation by hand is not covered in this documentation.

Sub-components
--------------

A component may also require or permit installation of sub components. A sub-component
is only an extension of the main component, in order for a component to provide
different type of similar functionality and eliminate the need  to keep all of the
sub components and its dependencies installed if not used. One such example is a
*View* component. The *View* component by itself provides all that you need to write
templates and views for your application. But it also provides a sub component for
the `Twig Templating Engine <http://twig.sensiolabs.org/>`_, which of course installs
it as a dependency.

Component configuration file
----------------------------

In order for a library to be a valid component for the SlaxWeb Framework, it needs
to be obtainable through `Composer <https://getcomposer.org/>`_, and it also needs
to provide a valid **composer.json** configuration file. A valid configuration file::

    {
        "name": "component_name",
        "description": "Component description",
        "type": "main",
        "providers": {
            "app": [],
            "commands": [],
            "hooks": []
        },
        "configFiles": [],
        "subcomponents": {
            "list": {},
            "required": false,
            "multi": false
        },
        "scripts": {}
    }

Type
````

There are only two type of component types at the moment, **main** and **sub**.
**main** is the main component, and **sub** is the sub component. The **main** component
may define sub-components, while the **sub** must define a **parent** in its configuration,
and the **subcomponents** configuration is completely ignored even if present, as
the sub component may not have further sub components.

Providers
`````````

The **providers** configuration option provides 3 arrays that define different providers
that will be registered with the application when the component is installed. The
arrays must contain full class names of the providers for:

* **app** - Application :ref:`gen topics providers`
* **commands** - Slaxer :ref:`gen topics commands`
* **hooks** - :ref:`gen topics hooks`

Configuration files
````````````````````

If a component provides a configuration file, it must be added to the **config**
directory in the component root directory, and the configuration file name, must
be added to the **configFiles** component configuration file.

Sub-components
``````````````

The **subcomponents** section defines a **list** of subcomponents from which the
user can choose from when the component is being installed. The **required** option
states if a sub-component is required. If the value is *false*, then the user may
choose not to install any sub-component. **multi** permits the user to install multiple
sub-components for this component.

Scripts
```````

The **scripts** configuration defines scripts that are executed during various stages
of component installation. At the moment, only **postConfigure** stage is available.
The script must be a valid PHP script, and it must reside in the **scripts** directory
in the root directory of the component. An entry in the component configuration
file must also be made, where the key is the stage at which the script is to be
executed, and the value is the name of the script::

    // ...
    "scripts": {
        "postConfigure": "scriptName.php"
    }
    //...
