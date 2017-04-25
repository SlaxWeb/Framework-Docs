.. SlaxWeb Framework General Topics - Slaxer file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: bash

.. _gen topics slaxer:

Slaxer
======

Slaxer, pronounced *slacker*, is the command line tool of the Framework. It is used
to manipulate various components, simplifies building of command line applications,
and simplifies Framework upgrades between versions when applicable. For custom commands,
the Framework provides a loader for custom commands that can be written by the user.
But the main purpose of Slaxer is to simplify installation, maintenance, and removal
of Framework components.

Slaxer uses `Symfony Console <http://symfony.com/doc/current/components/console.html>`_
libraries to simplify interaction with the console and simplify creation of custom
commands.

Component manipulation
----------------------

Component manipulation refers to installation, maintaining, and removal of Framework
components that are not part of the core. For this the following commands are provided:

* component:install *[component name] <version>*
* component:upgrade *<component name> <version>*
* component:remove *[component name]*
* component:reconfigure *[component name]*
* component:list

Slaxer uses `Composer <https://getcomposer.org>`_ for component manipulation, and
such is advised that the **composer** executable is made available. If the **composer**
executable is not found, Slaxer will try to install composer by itself.

Install
```````
To install a component you need a name of the component. The name of the component
consists of a *vendor* and *name* separated by a forward slash *(/)*. By default,
Slaxer will attempt to install a package from the **slaxweb** vendor if one is not
supplied in the name itself.

In example, to install the *view* component from **slaxweb** you would navigate
to the root directory of the application and run::

    ./slaxer component:install view

This will begin installation of the *slaxweb/view* component. By default, the Framework
defines the components version for the currently installed Framework version. The
versions are defined in the **slaxer.php** configuration file. Should you wish to
install a different version of a component you may define it after the component
name::

    ./slaxer component:install view dev-develop

The above command will install the *slaxweb/view* component from the *develop* branch
of the component. This may lead to undesired functionality or lack of, and is therefore
discouraged. If you are installing a component not from the **slaxweb** vendor you
will have to define the version of that component in the **slaxer.php** configuration
file, or in the command line when installing. When no version is defined, neither
in the configuration file, nor in the command line when executing, Slaxer will fall
back to **dev-master** and attempt to install the component from that version.

Sub-components
''''''''''''''

When a component provides sub-components, those will be made available for choosing
when the main component has been installed. You will be prompted to enter the name
of a sub-component(s) separated by a comma(,), or **None** if the component does
not require a sub-component to be installed.

Upgrade
```````

.. WARNING::
   Component upgrade command is not yet available. It will be available in future
   releases of the framework.

Remove
``````

.. WARNING::
   Component remove command is not yet available. It will be available in future
   releases of the framework.

Reconfigure
```````````

.. WARNING::
   Component reconfigure command is not yet available. It will be available in future
   releases of the framework.

List
````

.. WARNING::
   Component list command is not yet available. It will be available in future releases
   of the framework.

.. _gen topics commands:

Custom Commands
---------------

To write your own custom commands, they must extend from the **\\Symfony\\Component
\\Console\\Command\\Command** class and define all the required methods. For more
information on this, please refer to the `Symfony Console documentation <http://symfony.com/doc/current/components/console.html>`_.
To make the command usable with Slaxer, you need to register it with the Framework.
To do so, you will have to make sure that your command class can be autoloaded,
and add it to the **commandList** configuration item in the **provider.php** configuration
file.
