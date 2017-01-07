.. SlaxWeb Framework Database - Configuration file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _database config:

Configuration
=============

When the **database** component is installed (please read :ref:`database install`),
a new configuration file is created in the **app/Config/** directory called **database.php**.
This configuration file contains the configuration for the database connection,
as well as settings for the Base Model.

Connecting to a Database
------------------------

The Database connection is configured in one simple array in the **database.php**
configuration file, with the name **connection**. The array requires the following
items to be present in the configuration:

* *driver*
* *hostname*
* *port* (optional)
* *database*
* *username*
* *password*

Driver
``````

In order for the connection to work, you need to have the correct PHP drivers installed
on your system. Here is a list of all available drivers in the **database** component
as constants:

* *Driver::DB_MYSQL* - **mysql (default)**
* *Driver::DB_PGSQL* - **pgsql**
* *Driver::DB_SQLITE* - **sqlite**
* *Driver::DB_ODBC* - **odbc**
* *Driver::DB_SQLSRV* - **sqlsrv**
* *Driver::DB_FIREBIRD* - **firebird**
* *Driver::DB_CUBRID* - **cubrid**
* *Driver::DB_DBLIB* - **dblib**
* *Driver::DB_IBM* - **ibm**
* *Driver::DB_INFORMIX* - **informix**
* *Driver::DB_OCI* - **oci**
* *Driver::DB_4D* - **4d**

To use a driver, set it to the **driver** attribute of the **connection** configuration.

Hostname
````````

A valid **hostname** at which the database may be reached. This can be an IP address
or a host name.

Port
````

Port is the only optional configuration item for the database connection. If **port**
is omitted from the **connection** configuration, then the default port for your
database driver will be used. The value of **port** must be a valid integer, otherwise
the setting will be ignored.

Database
````````

The **database** configuration item holds the name of the database to which you
wish to connect to.

Username & Password
```````````````````

The **username** and **password** are also required, and must be set to valid credentials
in order to connect to your database successfully.

Base Model Settings
-------------------

The **database.php** configuration file contains configuration options for setting
up the behaviour of a Base Model. For use of the Base Model please see the :ref:`database basemodel`
section of this documentation.

Table name guessing
```````````````````

The Base Model will try to guess the name of the database table that it represents,
and for this it provides you with 3 options:

* *autoTable* - **bool** - turns table name guessing on and off
* *pluralizeTableName* - **bool** - if turned on, the name of the table will be
  pluralized after the model name has been transformed to the table name
* *tableNameStyle* - **constant** - :ref:`database config tablestyle`

.. _database config tablestyle:

Table Name Style
''''''''''''''''

The Base Model converts the class name of the model to a table name. Since table
names can be in different styles, the Base Model can be configured to convert the
class name into a specific table name style. To do so, use one of the following
**constants**:

* *BaseModel::TBL_NAME_CAMEL_UCFIRST* - CamelizedUpperCaseFirst
* *BaseModel::TBL_NAME_CAMEL_LCFIRST* - camelizedLowerCaseFirst (default)
* *BaseModel::TBL_NAME_UNDERSCORE* - separated_by_underscores
* *BaseModel::TBL_NAME_UPPERCASE* - ALLUPPERCASE
* *BaseModel::TBL_NAME_LOWERCASE* - alllowercase

To keep the same style of naming as the class name, set it to the **bool** value
false.
