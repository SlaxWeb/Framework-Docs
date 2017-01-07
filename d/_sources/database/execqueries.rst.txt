.. SlaxWeb Framework Database - Executing Queries file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. TODO: Link Database Library to the class documentation of the Library interface.

.. highlight:: php

.. _database execqueries:

Executing Queries
=================

While the Database Library provides a :ref:`database querybuilder`, it also provides
functionality to execute hand written queries.

The Database Library is available in the :ref:`gen topics application` under the
name **databaseLibrary.service**, or if you are using the :ref:`database basemodel`,
you can access it with the **$db** protected property.

Run custom query
----------------

To execute a custom query, the Database Library provides the **execute** method
for this purpose::

    <?php
    // code ...
    $dbLib->execute("INSERT INTO table VALUES ('val')");
    // code ...

The **execute** method will return a *bool* true value if the query was executed
successfully, and a *bool* false value if the query execution resulted in an error.

Error handling
--------------

When an error occurs in execution of the query, the Database Library sets an error
object to its internal *$error* protected property. To obtain the error **lastError**
method is available in the Database Library which returns the Database Error object.
The Error object contains the error message and the executed query, both accessible
as properties *message* and *query*::

    <?php
    // code ...
    if ($dbLib->execute("erroneous query") === false) {
        $error = $dbLib->lastError();
        $log->error("Error occurred", ["message" => $error->message, "query" => $error->query]);
    }
    // code ...

.. NOTE::
   Error object will contain more error data in the future. Nothing has yet been
   decided in this field, and suggestions are accepted.

Query parameters
----------------

When you are going to execute a query with parameters from an external origin, it
is recommended that you bind them to the query, instead of concatenating them directly
into the string that represents your query for higher security. To do this, the
**execute** method accepts an array of parameters as the second parameter, all you
need to do is mark where you wish to bind the parameters.

Sequential parameter binding
````````````````````````````

With sequential parameter binding the parameters are bound to the query in the order
that they are found in the array of parameters. The question mark *(?)* is used
in the query to mark where a parameter will be bound. The first parameter from the
array will be bound to the first question mark::

    <?php
    // code ...
    $dbLib->execute(
        "SELECT col1 FROM table WHERE col2 = ? AND col3 = ?",
        ["col2 value", "col3 value"]
    );
    // code ...

The above piececode ... will execute the following query:

.. code-block:: sql

    SELECT col1 FROM table WHERE col2 = 'col2 value' AND col3 = 'col3 value'

Named parameter binding
```````````````````````

The named parameters are similar to sequential parameters, only that they have a
name, and can be reused multiple times in the query, without specifying it multiple
times in the array. However, the array has to be associative, where the key is the
name of the bind, and the value is the value of the parameter.

The parameter name must be prepended by a colon *(:)*, and it must be so in the
query, as in the associative array::

    <?php
    // code ...
    $dbLib->execute(
        "SELECT col1 FROM table WHERE col2 = :param OR col3 = :param",
        [":param" => "value"]
    );
    // code ...

As you can see, the above example reuses the *:param* parameter twice, and the array
contains it only once. The above example will execute the following example:

.. code-block:: sql

    SELECT col1 FROM table WHERE col2 = 'value' or col3 = 'value'

.. _database execqueries fetchdata:

Fetching data
-------------

When you wish to retrieve data from the database, you execute the query normally
with the **execute** method, and upon successful execution, the **fetch** method
can be ran to obtain the **Result** object:

.. NOTE::
   If a query has not yet been ran or did not yield a valid result set, an Exception
   will be thrown.

.. code-block:: php
   :linenos:

    <?php
    // code ...
    if ($dbLib->execute("SELECT col1, col2, col3 FROM table")) {
        try {
            $result = $dbLib->fetch();
        } catch (Exception $e) {
            // handle error
        }
    }

Reading results
```````````````

There are multiple ways to read data from the **Result** object. The **getResults**
method will return the raw `PDO <http://www.php.net/pdo>`_ data array for you to
manipulate further.

Iterating rows
''''''''''''''

Further methods to obtain data require you to iterate rows. To do so the **Result**
object provides the following methods:

* *next*
* *prev*
* *row*

The **next** method will move the internal pointer to the next row in the result
set.

.. WARNING::
  The **next** method has to be called before data can be accessed, as the pointer
  does not point to a valid row when the **Result** object is instantiated.

The **prev** method will move the internal pointer to the previous row in the result
set.

The **row** method will set the internal pointer to the desired row, as it requires
the row number as input.

All of the above return a *bool* success status. Bellow examples show how you can
use them in practice. For this example we assume we have a result set of 5 rows::

    <?php
    // code ...
    $result = $dbLib->fetch(); // current row: 0, invalid row
    $result->next(); // current row: 1, return value: true
    $result->prev(); // current row: 1, return value: false
    $result->row(4); // current row: 4, return value: true
    $result->prev(); // current row: 3, return value: true
    // code ...

The **Result** object also provides the **rowCount** method that returns the number
of rows in the result set.

Getting row data
''''''''''''''''

When the pointer is set to a valid row the whole row from the result set can be
obtained with the **get** method. The **get** method returns the row object, where
all the columns are accessible as properties. The bellow example continues from
the :ref:`database execqueries fetchdata` example:

.. code-block:: php
   :lineno-start: 10

    if ($result->next() === false) {
        // handle error
        return false;
    }
    $row = $result->get();
    if ($row->col1 === "value") {
        // handle scenario
    }

The **Result** object also provides a magic get method that will automatically read
the column value from the current row in the result set, so you do not need to obtain
the row with **get** first. Continuing from above example:

.. code-block:: php
   :lineno-start: 18

    if ($result->col2 === "value") {
        // handle scenario
    }

Both above methods may throw a **\\SlaxWeb\\Database\\Exception\\RowNotFoundException**
if the pointer is not set to a valid row in the result set. Additionaly the magic
get method will throw a **\\SlaxWeb\\Database\\Exception\\ColumnNotFoundException**
if the requested column is not found in the current row in the result set.

PDO
---

If direct access to the `PDO <http://www.php.net/pdo>`_ object is required, you can
obtain it from the :ref:`gen topics application` under the name **pdo.service**,
however, this documentation does not cover the documentation for PDO, as it is already
freely available on the PHP website http://www.php.net/pdo.
