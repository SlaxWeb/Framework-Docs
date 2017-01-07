.. SlaxWeb Framework Database - Installation file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: bash

.. _database install:

Installation
============

Even though most applications rely on data in a database, the **database** component
is not one of the core components in SlaxWeb Framework. Installation is done simply
as any other component with the :ref:`gen topics slaxer` Command Line tool.

The **database** component requires a sub-component to be installed, currently only
**database-pdo** sub-component is available, and uses `PHP Data Objects <http://php.net/pdo>`_
for interaction with the database engine. This part of documentation will cover
only this sub-component, even when different sub-components are made available.

To install simply start the component installation with Slaxer::

    ./slaxer component install database

And follow the on screen instructions to install the **database-pdo** sub-component.
Once everything is installed, move to the next section of this documentation to
set up a connection to the database.
