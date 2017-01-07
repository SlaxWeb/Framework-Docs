.. SlaxWeb Framework Router component documentation file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _router component:

Router Component
================

The Router helps you route your incoming requests to the correct code, and is one
of the essential components in modern web applications, especially those which rely
on a single entry point. With a Router, you control which part of your code will
handle an incoming request, based on its URI and request method. The Router component
also provides the **Request** and **Response** classes that simplify request handling,
response handling, redirects, and so on.

The Router Component is one of the core Components and is therefore installed with
the Framework, and therefore can not be removed. It routes incoming requests to
the correct application code. In order to do that, you have to define a Route with
the correct *URI*, *HTTP Method*, and a valid *Action*.

Note that in order to use the Framework, you do not need to instantiate any of the
bellow elements of the component. The documentation is provided only if you need
to use the Router in any extra ordinary case. The normal usage inside the Framework
can be found in :ref:`router framework use`.

Route
-----

A **Route** is the main element of the Router Component. The Router Component will
try to match an incoming *Request* with a *Route*. In order for a *Route* to match
an incoming *Request* both the **URI** and the **HTTP Method** must match exactly.

The Router Component provides a *Factory* that instantiates a new *Route* object.
The *Factory* can be obtained from the Application Service Repository::

    $route = $app["router.newRoute"];

URI
```

The **URI** part of the *Route* is essentially a **regexp** string to which the
beginning and end **regexp** delimiters are added automatically and should not be
added by the user. That is to make use of it a lot simpler, and for basic URI matching
a simple name in the URI is enough. You do not need to know **regexp** in order
to use SlaxWeb Framework Routes. It is available only if you need more advanced
URI matching. It also provides pseudo-classes for parameters in the URI to simplify
parameter matching.

The pseudo-classes in use are **[:params:]** and **[:named:]**. The **params** pseudo
class will convert anything it matches to parameters, and will inject them as an
array to the Query parameters of the **Request** object under the key **parameters**.
The parameters are separated with a forward slash *(/)*.  The **named** pseudo-class
does the same, only it matches the URI segments in pairs, where the first segment
is the **name** of the parameter, and the second segment is the **value** of the
parameter. Example:

+--------------------+----------------------------------+------------------------------------------------------------+
| uri                | request uri                      | results                                                    |
+====================+==================================+============================================================+
| myroute/[:params:] | /myroute/val1/val2               | Query parameters: ["parameters" => ["val1", "val2"]]       |
+--------------------+----------------------------------+------------------------------------------------------------+
| myroute/[:named:]  | /myroute/param1/val1/param2/val2 | Query parameters: ["param1" => "val2", "param2" => "val2"] |
+--------------------+----------------------------------+------------------------------------------------------------+

Method
``````

The **Method** part of the *Route* defines for which *Request* methods this particular
*Route* will match. Internally a binary number is used to represent an HTTP Method,
but the **Route** class provides them as class constants. For information on the
constants, please refer to the :ref:`router class reference`.

A single *Route* can be defined for multiple HTTP Methods. In order to achieve this
a logical or *(|)* should be used when defining multiple HTTP Methods for the *Route*.

Action
``````

The **Action** is where all the magic happens. In here you define how you wish to
handle the *Request*. There for the **Action** has to be of type **Callable**. The
Router will call the Route with 3 parameters. The **Request** object, the **Response**
object, and the **Application Service Registry** object, in that particular order.
Fully qualified class names for all 3 objects:

* \\SlaxWeb\\Router\\Request
* \\SlaxWeb\\Router\\Response
* \\SlaxWeb\\Bootstrap\\Application

Container
---------

The **Container** is a simple class that holds all the defined routes in one place.
Even if a **Route** class is initialised, and a valid Route has been configured
with it, it needs to be added to the **Container** in order to be recognized by
the Framework once it is trying to match an incoming *Request* to a *Route*.

The **Container** class is accessible through the Application Service Repository::

    $container = $app["routesContainer.service"];

Dispatcher
----------

The **Dispatcher** is the main element of the Router Component. The Dispatcher is
responsible for matching an incoming *Request* with existing *Routes* in the *Container*.
If it does not find a match, it throws an *Exception* that is currently not handled
anywhere. To avoid this, a 404 route has to be defined with the **Route** class.

The **Dispatcher** class is accessible through the Application Service Repository::

    $dispatcher = $app["routeDispatcher.service"];

Hooks
`````

The Dispatcher executes the following Hooks at various points of execution. Some
supply the Hook definition with a parameter, and some use the return value. Check
the description of a hook to find out more:

+----------------------------------+--------------------------+--------------------------+--------------------------------------------------------+
| name                             | parameters               | return                   | description                                            |
+==================================+==========================+==========================+========================================================+
| router.dispatcher.afterInit      | none                     | none                     | | Executed after the Dispatcher class is instantiated. |
+----------------------------------+--------------------------+--------------------------+--------------------------------------------------------+
| router.dispatcher.beforeDispatch | \\SlaxWeb\\Router\\Route | bool                     | | Executed after a *Route* has been matched to         |
|                                  |                          |                          | | the incoming *Request*, and before it has been       |
|                                  |                          |                          | | dispatched to the *Routes* Action.                   |
|                                  |                          |                          | | The *Route* object is supplied as parameter.         |
|                                  |                          |                          | | If bool(false) is returned, the Dispatcher will not  |
|                                  |                          |                          | | execute the Route as it expects the Hook definition  |
|                                  |                          |                          | | to do it instead.                                    |
+----------------------------------+--------------------------+--------------------------+--------------------------------------------------------+
| router.dispatcher.afterDispatch  | none                     | none                     | | Executed after the incoming *Request* has been       |
|                                  |                          |                          | | dispatched to the *Routes* Action, and the           |
|                                  |                          |                          | | Action has finished executing.                       |
+----------------------------------+--------------------------+--------------------------+--------------------------------------------------------+
| router.dispatcher.routeNotFound  | none                     | \\SlaxWeb\\Router\\Route | | Executed if no matching *Route* was found for the    |
|                                  |                          |                          | | incoming *Request*. If the Hook definition returns a |
|                                  |                          |                          | | valid *Route* object, then this *Route* object will  |
|                                  |                          |                          | | be used by the dispatcher.                           |
+----------------------------------+--------------------------+--------------------------+--------------------------------------------------------+

Request
-------

The **Request** element of the Router Component reuses the **Request** element of
the `Symfony 3 HTTP Foundation Component <http://symfony.com/doc/current/components/http_foundation.html>`_.
By clicking on the link you will be taken to the Symfony 3 documentation that you
can use for reference on using the **Request** element of the Router Component.
The SlaxWeb Framework extends the **Request** element of the Symfony Component to
allow for easier additions to the request query parameters.

Response
--------

The **Response** element of the Router Component reuses the **Response** element
of the `Symfony 3 HTTP Foundation Component <http://symfony.com/doc/current/components/http_foundation.html>`_.
By clicking on the link you will be taken to the Symfony 3 documentation that you
can use for reference on using the **Response** element of the Router Component.

The SlaxWeb Framework extends the **Response** element of the Symfony Component
to provide you with simpler ways of redirecting the visitor within the SlaxWeb Framework
application, and simplify adding of your own content to the *Response*. To do so
two additional methods are provided, **redirect** and **addContent**. Please refer
to the :ref:`router class reference` documentation.

.. _router framework use:

Route Collections
-----------------

Route Collections enable a simplified use of the Router inside the Framework. Route
Collections are essential Service Providers that define *Routes* for the Router
Component. The Framework already provides a **DefaultCollection** class that can
be found in the **app/Routes/DefaultCollection.php** file. You can define further
*Routes* directly in that class, or create a new collection class that extends from
the **\\SlaxWeb\\Router\\Service\\RouteCollection** class. The Route Collection
class must define a **define** method. The **define** method is called when the
Route Collection Service Provider class is registered with the Application Service
Repository. The **define** method definition should add the route definitions that
you wish to include in your application to the **routes** array. This **routes**
array will then be parsed, and added to the *Container*.

The **routes** array does not contain the finished *Route* objects, it holds only
the data required to create *Route* objects. To do so it must hold the following
data:

* **uri**
* **method**
* **action**

Adding a route
``````````````

To add a route you simply assign the required data to the **routes** array in the
Route Collections::

    use SlaxWeb\Router\Route;
    use SlaxWeb\Router\Request;
    use SlaxWeb\Router\Response;
    use SlaxWeb\Bootstrap\Application as App;

    $this->route[] = [
        "uri"       =>  "",
        "method"    =>  Route::METHOD_GET,
        "action"    =>  function(Request $request, Response $response, App $application) {
            // custom route definition ...
        }
    ];

The above route data will be used to create a *Route* object automatically and it
will be added to the Routes Container, if the Route Collection class has been loaded
by the Framework. This route matches only the *home page* call, where no URI is
present, and only when a GET HTTP Request is made. A more advanced Route::

    use SlaxWeb\Router\Route;
    use SlaxWeb\Router\Request;
    use SlaxWeb\Router\Response;
    use SlaxWeb\Bootstrap\Application as App;

    $this->route[] = [
        "uri"       =>  "uri/[:params:]|myotheruri/[:named:]",
        "method"    =>  Route::METHOD_POST | Route::METHOD_PUT,
        "action"    =>  function(Request $request, Response $response, App $application) {
            // custom route definition ...
        }
    ];

The above route will be added to the Container all the same as the first one, but
will match any URI beginning with *uri/* and every following segment will be converted
to a parameter which is obtainable through the **Request** object. At the same time
it will also match any URI beginning with *myotheruri/* and convert all following
URI segments to named parameters. It also matches all *Requests* that are made either
with the POST HTTP Method, or the PUT HTTP Method.

Services
--------

The Router component provides the following services that can be obtained from the
Application class of the :ref:`bootstrap component`:

* **router.newRoute** - Factory that obtains a new **Route** object on each call
* **routesContainer.service** - obtains the **Container** instance when called
* **routeDispatcher.service** - obtains the **Dispatcher** instance when called
* **request.service** - obtains an instance of the **Request** object when called
* **response.service** - obtains an instance of the **Response** object when called

.. _router class reference:

Class reference
---------------

Class reference for the Router Component is available in an external documentation.
Click `here <router/classref/index.html>`_ to go to that documentation now.
