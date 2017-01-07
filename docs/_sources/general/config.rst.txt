.. SlaxWeb Framework General Topics - Configuration file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics config:

Configuration
=============

Configuration in the SlaxWeb Framework is done in plain PHP files that are automatically
loaded and parsed on boot-up of the Framework. All configuration files located in
the **app/Config/** directory are loaded automatically.

Configuration file structure
----------------------------

The configuration files must be in PHP format and must provide an associative array
in the *$configuration* variable. There is currently no limit on particular values
for the configuration items. Two valid examples for configuration files::

    <?php
    $configuration["myConfigItem"] = true;

Or::

    <?php
    $configuration = [
        "myConfigItem"  =>  true
    ];

Loading configuration items
---------------------------

The Framework automatically loads all configuration files found in the **app/Config/**
directory. Even in sub-directories of that directory are automatically scanned.
All found configuration item names or keys are prepended with the name of the file
and a period*(.)*. If our above example is put in **app/Config/test.php** file,
then the configuration item from the example can be obtained with the name **test.myConfigItem**.

.. NOTE::
   Configuration items are prepended with the name of the configuration file *ONLY*
   if the configuration file is in the root configuration directory, *app/Config/*.
   If the configuration file is in a sub-directory, then the configuration item
   key is as defined in the file, and is not prepended.

Reading configuration
---------------------

The :ref:`config component` provides a service, **config.service**, which can be
accessed through the :ref:`gen topics application`. The configuration service also
implement the `ArrayAccess <http://php.net/manual/en/class.arrayaccess.php>`_ interface
so you can simply access configuration items. Continuing with the above example::

    <?php
    $config = $application["config.service"];
    $myConfigItem = $config["test.myConfigItem"];

.. WARNING::
   Changing of configuration items in runtime does not persist across multiple requests!
