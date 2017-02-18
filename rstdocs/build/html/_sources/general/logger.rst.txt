.. SlaxWeb Framework General Topics - Logger file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics logger:

Logger
======

The SlaxWeb Framework exposes the `Monolog logger library <https://github.com/Seldaek/monolog>`_
as a service to the Application object. It provides 3 different loggers of which
2 are reserved for internal workings. All 3 are reachable through the **logger.service**
service name in the :ref:`gen topics application`, and are exposed as protected
functions to it.

Using the logger
----------------

To obtain a logger, simply call the **logger.service** service on the :ref:`gen
topics application` and pass the name of the logger as the first parameter::

    <?php
    $logger->$app["logger.service"]("SlaxWebApp");

If the input parameter is ommited, the service will return the default logger that
is set with the **defaultLogger** configuration option in the **logger.php** configuration
file.

For actual use of the logger, please refer to the `Monolog logger library <https://github.com/Seldaek/monolog>`_
documentation.

Configuring the logger
----------------------

Loggers can be configured in the **logger.php** configuration file.

defaultLogger
'''''''''''''

The **defaultLogger** must contain the name of a logger defined in the **loggerSettings**
configuration, and is used when no input is supplied to the **logger.service** call.

logFilePath
'''''''''''

The **logFilePath** defines a path where all the loggers will write their log files.
This directory has to be writable.

loggerSettings
''''''''''''''

**loggerSettings** is an array containing all the required configuration for the
logger. It defines a logger with the name of the logger being the key of the array
item. The array item is nested associative array containing the type of the logger
as the key, and an array of options. The first entry being the file name to which
the logger will log to, and the log level. If the path is absolute, the **logFilePath**
is ignored. Example entry::

    <?php
    $configuration["loggerSettings"] = [
        "MyLogger"  =>  [
            Log::L_TYPE_FILE    =>  [
                "MyLogger.log",
                Logger::ERROR
            ]
        ]
    ];

The above example logger will log to the *MyLogger.log* file in the **logFilePath**
path, but only messages that are of severity *Error* or higher. Available severity
options are:

* Logger::EMERGENCY
* Logger::ALERT
* Logger::CRITICAL
* Logger::ERROR
* Logger::WARNING
* Logger::NOTICE
* Logger::INFO
* Logger::DEBUG

Reserved loggers
----------------

The **System** and **Slaxer** loggers are reserved for the Framework. The Framework
logs everything with the **System** logger, while the :ref:`gen topics slaxer` command
line tool and it commands use the **Slaxer** logger for logging. Removing these
loggers from the configuration will break the Framework!
