.. SlaxWeb Framework Database - Migrations file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. TODO: Link Database Library to the class documentation of the Library interface.

.. highlight:: php

.. _database migrations:

Migrations
==========

Database migrations are like version controls for the changes in the database. The
SlaxWeb Database-PDO sub-component provides simple database migrations system, as
a set of :ref:`gen topics slaxer` commands. Obviously the **database** component
and the **database-pdo** sub-component have to be installed, please refer to the
Database :ref:`database install` part of the documentation.

The database migrations system provides you a PHP class for each migration that
you create with the :ref:`gen topics slaxer` command, and in that class you have
access to the Database Library instance, as well as the :ref:`database querybuilder`.

Creating a migration
--------------------
