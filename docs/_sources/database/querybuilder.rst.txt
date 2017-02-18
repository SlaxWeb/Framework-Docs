.. SlaxWeb Framework Database - Query Builder file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. TODO: Link Database Library to the class documentation of the Library interface.

.. highlight:: php

.. _database querybuilder:

Query builder
=============

The Query Builder simplifies running queries against the database, as it does not
require you to write the queries by hand, and thus introduce a different language
into your PHP source code. The Query Builder does however, not just build the queries
for you, it also executes them.

The Query Builder is available in the :ref:`database basemodel` as well as in the
Database Library. Both use same methods, but the Database Library methods have an
extra input argument, the table name must be added as the first argument in every
method call. For this reason it is recommended that you use the :ref:`database basemodel`
and this documentation will cover only this scenario as well.

Creating data
-------------

Data creation is simply handled by the **create** method. It takes an associative
array as input, where the keys represent the columns, and the values represent the
data to be inserted::

    <?php
    // code ...
    $model->create([
        "col1"  =>  "value",
        "col2"  =>  1
    ]);
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    INSERT INTO "table" ("col1", "col2") VALUES ('value', 1)

The **create** method returns a *bool* status.

Updating existing data
----------------------

Updating data is also simply done with the **update** method. It requires an associative
array of column names as keys and new values as array values as the input argument.
Upon a successful update, boolean value **true** is returned, or **false** on error.

The **update** method of the query builder will also create the *WHERE* statements
for the data retrieval query. Refer to :ref:`database querybuilder where` part of
this documentation for more information on building *WHERE* statements. The bellow
example shows a simple update query::

    <?php
    // code ...
    $model->update(["col1" => "foo"]);
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    UPDATE "table" SET "table"."col1" = 'foo' WHERE 1=1

Deleting data
-------------

Data deletion is as simple as data creation, the **delete** method will generate
a *DELETE* statement and execute it, and return a *bool* status. To limit deletion
the Query Builder will generate *WHERE* statements for the query as well. Refer to
:ref:`database querybuilder where` part of this documentation for more information
on building *WHERE* statements. Bellow example will delete all records from a database
table::

    <?php
    // code ...
    $model->delete();
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    DELETE FROM "table" WHERE 1=1

Soft deletes
````````````

.. ATTENTION::
   Soft deletes are planed for future releases and are as of yet not possible, but
   will function as described.

.. ATTENTION::
   Soft deletes are possible only with the :ref:`database basemodel`, the Database
   Library does not support it!

Soft deletion does not delete the data row from the database, but only marks them
as deleted with a special column. By default this feature is disabled, and calling
the **delete** the data row will be deleted from the database permanently.

To use soft deletes they have to be enabled in the **database.php** configuration
file, by setting the **softDeletes** to **true**. By default, the soft deleted rows
are marked by setting the boolean value of **true** to the **deleted** column.

The **softDeleteTimestamp** configuration option is set to **false** by default,
if you set it to **true**, then instead of setting a boolean value of **true** to
the **deleted** column the soft delete will write a timestamp into the **deleted**
column. The column must be *nullable*, as not deleted items will have the value of
*NULL* set.

If you wish to keep the records of deletion in a different column, you can set it
in the **softDeleteCol** configuration option.

Data retrieval
--------------

To obtain data the query builder provides the **select** method which will generate
the *SELECT* SQL statement, execute it and return the **Result** object. More information
about obtaining data from the **Result** object can be found in the :ref:`database
execqueries fetchdata` section of the documentation.

You are required to supply an array of the column names that you want in the *SELECT*
statement as the first and only parameter of the **select** method call.

The **select** method of the query builder will also create the *WHERE* statements
for the data retrieval query. Refer to :ref:`database querybuilder where` part of
this documentation for more information on building *WHERE* statements. The bellow
example shows a simple data retrieval query::

    <?php
    // code ...
    $result = $model->select(["col1"]);
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT "col1" FROM "table" WHERE 1=1

A successful execution will return the **Result** object, as well as store it inside
the *Base Model*. You can obtain data from the returned **Result** object or directly
from the model itself, using the exact same method. :ref:`database execqueries fetchdata`
is already covered in the linked documentation, please refer to it for more information.

If you attempt to access results through the model and a successful data retrieval
was not made before, the model will throw a **\\SlaxWeb\\Database\\Exception\\NoDataException**.

.. _database querybuilder where:

Where statements
----------------

*WHERE* statements help you limit the range of rows in the database on which you
execute the query. Be it data obtaining, data deletion, or data amending, the query
builder will automatically try and create a *WHERE* statement for the next query,
if you have set it up. To do so, the query builder provides the following methods:

* **where**
* **orWhere**
* **groupWhere**
* **orGroupWhere**
* **nestedWhere**
* **orNestedWhere**

As you may have already noticed, the Query Builder adds the first static predicate,
*1=1* to all queries, no matter if custom *WHERE* predicates follow or not. This
is done to simplify and enhance performance of the query builder.

For examples bellow, only the **select** method is used, but *WHERE* statements
can be combined with other queries as well.

where
`````

The **where** method creates a simple *WHERE* predicate. It will link it to other
predicates with the logical **AND** operator. It takes the name of the column as
the first argument, and the value as the second argument. The last argument defines
the logical operator for the column, default being the equal symbol *(=)*. The example
shows how you use the **where** method, and how you can alter the logical operator::

    <?php
    // code ...
    $model->where("col1", "foo")
        ->where("col2", ["bar", "baz"], "IN")
        ->select("col3");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col2"
    FROM
        "table"
    WHERE
        1=1
        AND "table"."col1" = 'foo'
        AND "table"."col2" IN ('bar','baz)';

orWhere
```````

**orWhere** is exactly the same as **where** only it will link the predicate with
a logical **OR** operator to the previous predicate:

.. WARNING::
   Using *OR* versions is not recommended as the first predicate, as it will contain
   all rows because of the initial *1=1* predicate in every query.

::

    <?php
    // code ...
    $model->where("col1", "foo")
        ->orWhere("col2", "bar%", "LIKE")
        ->select("col3");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col2"
    FROM
        "table"
    WHERE
        1=1
        AND "table"."col1" = 'foo'
        OR "table"."col2" LIKE 'bar%';

groupWhere
``````````

Grouping *WHERE* predicates is nearly a necessity in more complex statements. To
be able to group predicates the Query Builder provides the **groupWhere** method.
The method takes a **Closure** as its only parameter. The **Closure** will receive
an instance of a Query Builder as input, you can use all the *where* methods as
normal::

    <?php
    // code ...
    $model->groupWhere(function ($builder) {
            $builder->where("col1", "foo")
                ->orWhere("col2", "bar");
        })->groupWhere(function ($builder) {
            $builder->where("col3", "baz")
                ->orWhere("col4", "qux");
        })->select("col5");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col5"
    FROM
        "table"
    WHERE
        1=1
        AND (
            "table"."col1" = 'foo'
            OR "table"."col2" = 'bar'
        ) AND (
            "table"."col3" = 'baz'
            OR "table"."col4" = 'qux'
        );

orGroupWhere
````````````

**orGroupWhere** is exactly the same as **groupWhere** only it will link the grouped
predicates with a logical **OR** operator to the previous predicate:

.. WARNING::
   Using *OR* versions is not recommended as the first predicate, as it will contain
   all rows because of the initial *1=1* predicate in every query.

::

    <?php
    // code ...
    $model->groupWhere(function ($builder) {
            $builder->where("col1", "foo")
                ->orWhere("col2", "bar");
        })->orGroupWhere(function ($builder) {
            $builder->where("col3", "baz")
                ->orWhere("col4", "qux");
        })->select("col5");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col5"
    FROM
        "table"
    WHERE
        1=1
        AND (
            "table"."col1" = 'foo'
            OR "table"."col2" = 'bar'
        ) OR (
            "table"."col3" = 'baz'
            OR "table"."col4" = 'qux'
        );

nestedWhere
```````````

The **nestedWhere** method allows to bring in a *SELECT* statement as a *WHERE*
predicate. It functions similarly as **groupWhere**, only it takes the name of the
column as the first parameter, and the **Closure** as the second. The **Closure**
again receives the Query Builder as input. You must set the table name to that instance
of the Query Builder, and then use it as you have used it before::

    <?php
    // code ...
    $model->nestedWhere("col1", function ($builder) {
        return $builder->table("table2")
            ->select(["col1"]);
    })->select("col2");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "col2"
    FROM
        "table1"
    WHERE
        1=1
        AND "table1"."col1" IN (
            SELECT "table2"."col1" FROM "table2" WHERE 1=1
        );

orNestedWhere
`````````````

**orNestedWhere** is exactly the same as **nestedWhere** only it will link the grouped
predicates with a logical **OR** operator to the previous predicate:

.. WARNING::
   Using *OR* versions is not recommended as the first predicate, as it will contain
   all rows because of the initial *1=1* predicate in every query.

::

    <?php
    // code ...
    $model->where("col3", "foo")
        ->orNestedWhere("col1", function ($builder) {
        return $builder->table("table2")
            ->select(["col1"]);
    })->select("col2");
    // code ...

The above example will generate and execute the following query:

.. code-block:: sql

    SELECT
        "col2"
    FROM
        "table1"
    WHERE
        1=1
        AND "table1"."col3" = 'foo'
        OR "table1"."col1" IN (
            SELECT "table2"."col1" FROM "table2" WHERE 1=1
        );

Joins
-----

Joining on other or same tables is done simply with the Query Builder. It supports
multiple joins, multiple join conditions, and multiple join types. For this the
Query Builder supplies the following methods:

* **join**
* **joinModel**
* **joinCond**
* **orJoinCond**
* **joinCols**

And the following constants in the **\\SlaxWeb\Database\BaseModel** class for join
types:

* **JOIN_INNER** - *INNER* JOIN
* **JOIN_LEFT** - LEFT OUTER JOIN
* **JOIN_RIGHT** - RIGHT OUTER JOIN
* **JOIN_FULL** - FULL OUTER JOIN
* **JOIN_CROSS** - CROSS JOIN

join
````

The **join** method defines the table to which the SQL *JOIN* is to be made, and
which *type* of join. The method takes the name of the table as an operator, and
the type, which defaults to the *INNER JOIN* type.

The example bellow shows basic usage of the **join** method::

    <?php
    // code ...
    $model->join("table2", BaseModel::JOIN_LEFT);
    // code ...

If only the **join** method is called, an Exception will be thrown when executing
the query, the **joinCond** has to be called at least once and define a valid join
condition.

joinModel
`````````

The **joinModel** method conveniently extracts the table name from the joining model
and the primary key, allowing you to skip the **joinCond** call. The method takes
the Model object as first parameter, second parameter is the foreign key of the
main table, and the third parameter defines the type of join, which defaults to
the *INNER JOIN* type. The final parameter defines the comparison operator which
defaults to *equals (=)*.

The **joinModel** requires the joining model to have the **$primaryKey** protected
property properly set, otherwise a **\\SlaxWeb\\DatabasePDO\\Exception\\NoPrimKeyException**
is thrown. Example usage::

    <?php
    // code ...
    $model->join($otherModel, "foreign_key_column", BaseModel::JOIN_LEFT, "=");
    // code ...

The above code will generate the following JOIN statement:

.. code-block:: sql

    LEFT OUTTER JOIN "otherModelTable"
        ON ("table1"."foreign_key_column" = "otherModelTable"."primKey")

joinCond
````````

The **joinCond** method defines the join condition(s) for the last added join with
the **join** or **joinModel** method calls. If the **joinCond** is called before
either of those methods is called, an **\\SlaxWeb\\DatabasePDO\\Exception\\NoJoinTableException**
will be thrown. The method takes the main table column name on which the join is
to be made, and the column of the joining table. The third parameter defines the
logical operator for the join condition which defaults to *is equal (=)*.

The bellow example is a continuation from the above examples::

    <?php
    // code ...
    $model->joinCond("col1", "col2");
    // code ...

orJoinCond
``````````

**orJoinCond** is exactly the same as **joinCond** only it will link the join condition
with a logical **OR** operator to the previous join condition.

The bellow example is a continuation from the above examples::

    <?php
    // code ...
    $model->orJoinCond("col3", "col4");
    // code ...

joinCols
````````

The **joinCols** method is the final method for the *JOIN* statement. It is not
required, and the Query Builder will build a *JOIN* statement without it just fine.
The **joinCols** method defines which columns are to be put on the select column
list from the joining table.

The bellow example is a continuation from the above examples::

    <?php
    // code ...
    $model->joinCols(["col5"])->select(["col1"]);
    // code ...

The above examples will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table1"."col1",
        "table2"."col5"
    FROM
        "table1"
    LEFT OUTTER JOIN "table2"
        ON ("table1"."col1" = "table2"."col2")
        OR ("table1"."col3" = "table2"."col4")
    WHERE
        1=1

Grouping
--------

For column grouping the Query Builder provides a simple **groupBy** method that
adds the column to the group by list. It accepts the name of the column as an input
parameter::

    <?php
    // code ...
    $model->groupBy("col1")
        ->select(["col1"]);
    // code ...

The above examples will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col1"
    FROM
        "table"
    WHERE
        1=1
    GROUP BY
        "table"."col1"

Ordering
--------

To create an *ORDER BY* statement, the Query Builder provides a **orderBy** method.
The **orderBy** method takes the name of the column as the first input argument,
the second input argument defines the direction of the order, and it defaults to
**ASC**. The third argument may define a function to be used for that order, by
default it is an empty string::

    <?php
    // code ...
    $model->orderBy("col1", \\SlaxWeb\Database\BaseModel::ORDER_DESC, "sum")
        ->select([["func" => "sum", "col" => "col1", "as" => "summary"]]);
    // code ...

The above examples will generate and execute the following query:

.. code-block:: sql

    SELECT
        SUM("table"."col1") AS summary
    FROM
        "table"
    WHERE
        1=1
    ORDER BY
        SUM("table"."col1") DESC

Limit
-----

The Query Builder also allows you to limit the results with SQL *LIMIT* and *OFFSET*.
To do so, the method **limit** is provided, and it accepts two integers as input,
first one being *LIMIT* and second one being *OFFSET*. Offset is by default 0, and
usage is simple as with other methods, you just need to ensure it gets called before
calling the **select**, **update**, or **delete** methods::

    <?php
    // code ...
    $model->limit(5, 10)
        ->select(["col1"]);
    // code ...

The above examples will generate and execute the following query:

.. code-block:: sql

    SELECT
        "table"."col1"
    FROM
        "table"
    WHERE
        1=1
    LIMIT
        5
    OFFSET
        10

Timestamps
----------

.. ATTENTION::
   Timestamps are planed for future releases and are as of yet not possible, exact
   functionality is not yet defined, and is therefor not yet documented.

SQL functions
-------------

The Query Builder also provides possibility to add built in SQL functions to the
column list in select, insert, update, and join statements, as *MAX*, *COUNT*, and
so on. To do so, you have to provide a nested array in the **select**, **insert**,
**update**, or **joinCols** column lists. The nested array has to be associative,
it needs to hold the **func** key, which defines the SQL function, the column name
as the **col** key, and an optional **as** key that will define the name alias for
that SQL function::

    <?php
    // code ...
    $model->select([["func" => "count", "col" => "col1", "as" => "rowcount"]);
    // code ...

The above examples will generate and execute the following query:

.. code-block:: sql

    SELECT
        COUNT("table"."col1") AS rowcount
    FROM
        "table"
    WHERE
        1=1

.. NOTE::
   As of version 0.5 SQL functions are also supported in where statements.
