.. SlaxWeb Framework General Topics - Routing file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics routing:

Routing and URLs
================

With the SlaxWeb Framework you design the URLs as you want and need them. The Framework
does not limit you in any way. All you need to make sure, is that the requested
URI matches a defined route URI.

A valid Route therefore requires 3 essential elements:

* URI
* HTTP Method
* Action

The *URI* may be a full *URI* name, or a RegExp pattern. The :ref:`router component`
tries to match the Request *URI* with the Routes *URI* when looking for the correct
piece of code that needs to be executed for that Request.

The *HTTP Method* defines a Route only for that given *HTTP Method(s)*. If the *HTTP
Method* of the Request and the Route do not match, then the Route is not considered
a match for the Request.

The *Action* must be of type **Callable**. You use the *Action* to define the behaviour
of your application for the given Request.

.. NOTE::
   **Segment-based** URI matching can be enabled as described bellow.

Defining Routes
---------------

The Routes in SlaxWeb Framework are defined in the **Routes Collection** class file.
The Framework comes pre-installed with **DefaultCollection** collection class that
can be found in *app/Routes/DefaultCollection.php* file. You can define further
*Routes* directly in that class, or create a new collection class that extends from
the **\\SlaxWeb\\Router\\Service\\RouteCollection** class.

.. TIP::
   Read the Configuration segment of the General Topics to learn how to register
   new providers with the framework.

The Route Collection class must define a **define** method. The **define** method
is called when the Route Collection Service Provider class is registered with the
Application Service Repository. The **define** method definition should add the
route definitions that you wish to include in your application to the **routes**
array.

.. _route example:

Example
```````

This is an example route definition in the **DefaultCollection** class, the defined
Route will match a request made to **example.com/my/first/route**::

    <?php
    namespace App\Routes;

    use SlaxWeb\Router\Route;
    use SlaxWeb\Router\Request;
    use SlaxWeb\Router\Response;
    use SlaxWeb\Bootstrap\Application;

    class DefaultCollection extends \SlaxWeb\Router\Service\RouteCollection
    {
        public function define()
        {
            $this->routes[] = [
                "uri"       =>  "my/first/route",
                "method"    =>  Route::METHOD_ANY,
                "action"    =>  function (Request $request, Response $response, Application $app) {
                    // ... route definition ...
                }
            ];
        }
    }

Matching the URIs
-----------------

In the examples we will be using the **example.com** example domain, the domain
does not matter for Routing, as a Route can not be defined for a specific domain,
but a single Route is valid for all domains. To see how to define a Route in the
Route Collection see the :ref:`route example` above.

Default Route
`````````````

The default route handles a Request that has no URI attached to the URI, meaning
the Request contains only the domain, **example.com**. To define such a Route, the
*uri* part of the Route has to be an empty string::

    "uri"       =>  "",

Exact matching URI
``````````````````

The Router component will automatically add start of string and end of string RegExp
tokens, which means that if you just define a full URI, the Router will match only
that specific URI. The following example::

    "uri"       =>  "news/list",

Will match only **example.com/news/list**. It will not match anything else,
even if the leading URI is the same.

.. NOTE::
   The Router will automatically add an optional trailing slash to the Routes URI,
   so the above example will match **example.com/news/list** as well as **example.com/news/list/**.
   If you do not wish to have such behaviour, disable it in the Configuration!

.. ATTENTION::
   Automatic optional trailing slash as explained in the *NOTE* above is not yet
   implemented!

URL contains URI
````````````````

To match all URLs containing the routes URI we need to prepend and append the URI
with the URI definition with the RegExp *non-gredy match zero or more of anything*
token to the URI definition::

    "uri"       =>  ".*?news/list.*?",

The above URI will match any of the following URLs:

* example.com/news/list
* example.com/ **anything/** news/list **/anything**
* example.com/news/list **/anything**
* example.com/ **anything/** news/list

To match URLs which only start or end with the defined URI, simply remove the RegExp
token from the end or the beginning of the URI definition.

Multiple URIs
`````````````

If you want a single Route definition to handle multiple URLs, all you have to do
is define multiple URIs in the Route separated by a pipe::

    "uri"       =>  "news/list|news",

This way, your Route will now handle Requests with the **example.com/news** and
**example.com/news/list** URLs. The Router still automatically injects the start
of string and end of string RegExp tokens to all defined URIs.

Regular Expressions
```````````````````

If you are versed in Regular Expressions, you can use it freely in route definitions,
but is not covered in the documentation.

Handling HTTP Methods
---------------------

Routes can be limited to one or more HTTP Methods with the *method* key in the Route
definition in the **RouteCollection** class. In the above example the **METHOD_ANY**
constant is used, which does not limit the Route to any particular HTTP Method,
but simply allows all. The following HTTP Method constants are defined:

* METHOD_GET
* METHOD_POST
* METHOD_PUT
* METHOD_DELETE
* METHOD_ANY

If the method should handle *GET* and *POST* requests, you need to define them both
with the logical OR operator. Example::

    "method"    =>  Route::METHOD_GET | Route::METHOD_POST

The above example will match the defined URI for requests that either come with
through the HTTP GET or the HTTP POST methods.

Route Action
------------

Route Action is the definition that gets executed when a Request is matched to the
Route.The Action must be of type callable and gets the following parameters as input:

* *\\SlaxWeb\\Router\\Request* - Request object
* *\\SlaxWeb\\Router\\Response* - Response object
* *\\SlaxWeb\\Bootstrap\\Application* - :ref:`gen topics application`

.. ATTENTION::
   The Request and Response objects are not deprecated, only the input parameters
   are deprecated. In the future only the Application object will be injected, as
   both Request and Response objects can be obtained through the Application object.

Request
```````

The **Request** element of the Router Component reuses the **Request** element of
the `Symfony 3 HTTP Foundation Component <http://symfony.com/doc/current/components/http_foundation.html>`_.
By clicking on the link you will be taken to the Symfony 3 documentation that you
can use for reference on using the **Request** element of the Router Component.
The SlaxWeb Framework extends the **Request** element of the Symfony Component to
allow for easier additions to the request query parameters.

Response
````````

The **Response** element of the Router Component reuses the **Response** element
of the `Symfony 3 HTTP Foundation Component <http://symfony.com/doc/current/components/http_foundation.html>`_.
By clicking on the link you will be taken to the Symfony 3 documentation that you
can use for reference on using the **Response** element of the Router Component.

The SlaxWeb Framework extends the **Response** element of the Symfony Component
to provide you with simpler ways of redirecting the visitor within the SlaxWeb Framework
application, and simplify adding of your own content to the *Response*. To do so
two additional methods are provided, **redirect** and **addContent**. Please refer
to the :ref:`router class reference` documentation.

Route specific hooks
--------------------

The router component, or more specifically, the Router Dispatcher executes a generic
before and after dispatch hooks before a request route is dispatched, and immediately
after. More information about those hook calls can be found in the :ref:`components
router hooks` section of the Router Component documentation.

The Router however supports executing Route specific before and after dispatch hooks
instead of the generic ones. To do so, the *Route* object provides a method **setHook**
method to set them. It accepts a string name as the first parameter, and an optional
*bool* value as the second paramater, when set to **true** the hook will be used
as an *after* hook. Example::

    <?php
    // code ...
    $route->setHook("myRouteBeforeDispatchHook");
    $route->setHook("myRouteAfterDispatchHook", true);
    // code ...

The above example shows how to add a hook directly to the Route object. The Route
Collections also provide such functionality, where you can define a before and/or
after dispatch hook per Route definition, or you can set a before and/or after dispatch
hook name to the Collections property, and that hook will automatically be set for
all Routes defined in that collection, unless they define one on their own::

    <?php
    namespace App\Routes;

    use SlaxWeb\Router\Route;
    use SlaxWeb\Router\Request;
    use SlaxWeb\Router\Response;
    use SlaxWeb\Bootstrap\Application;

    class DefaultCollection extends \SlaxWeb\Router\Service\RouteCollection
    {
        protected $beforeDispatch = "myCollection.beforeDispatch";
        protected $afterDispatch = "myCollection.afterDispatch";

        public function define()
        {
            $this->routes[] = [
                "uri"       =>  "my/collection/hook",
                "method"    =>  Route::METHOD_ANY,
                "action"    =>  function (Request $request, Response $response, Application $app) {
                    // ... route definition ...
                }
            ];

            $this->routes[] = [
                "uri"               =>  "my/special/hook",
                "method"            =>  Route::METHOD_ANY,
                "beforeDispatch"    =>  "myRoute.beforeDispatch",
                "action"            =>  function (Request $request, Response $response, Application $app) {
                    // ... route definition ...
                }
            ];
        }
    }

In the above example, the **my/collection/hook** route will execute the *myCollection.beforeDispatch*
and the *myCollection.afterDispatch* if the request matches that route. However
if the request matches the second route, **my/special/hook** then the *myRoute.beforeDispatch*
will be executed that is defined by the Route definition, but the *myCollection.afterDispatch*
will be executed anyway, since no after dispatch hook is defined specifically for
that Route.

.. _gen topic routing segmentbased:

Segment-based URI matching
--------------------------

Segment-based URI matching matches the first part of the URI to a *controller*,
the second part to a controller *method*, and all further segments are converted
to *parameters* that are sent to the controller method as input.

When the controller class is initialised, the **Application object** is injected
into it at construction. The controller has to be auto-loadable by the framework.
Read more about controllers in the :ref:`gen topics controller` section of the documentation.

Segment-based URI matching is disabled by default, and has to be enabled in the
**app.php** configuration file. To enable it, set **segmentBasedMatch** to **true**.

The **controllerNamespace** configuration option must be set to the correct value
in the **app.php** configuration file, as the Router will attempt to find Controller
classes in that namespace. The default controller method may also be changed with
the **segmentBasedDefaultMethod** configuration option in the same configuration
file.

The final option for Segment-based URI matching is the **segmentBasedUriPrepend**
configration option, which is empty by default. If this is set to any value, the
URI must start with this prepend in order to count as a valid URI for Segment-based
URI matching.

.. NOTE::
   The Controller segment is automatically converted into *ucfrist*, while the method
   will automatically be converted to *lcfirst* in segment-based URI matching.

Parameters
``````````

The Router takes the first segment after the URI prepend, and uses it as the controller
class name. The second segment after the URI prepend is used as the controller method.
If the second segment is not set, the **segmentBasedDefaultMethod** is used as the
method name by the router. All further segments will be injected into the controller
method as input parameters.

Examples
````````

The example uses the following settings:

* Enabled: **true**
* Controller Namespace: **\App\Controller**
* Default Method: **index**
* URI Prepend: **segment/based/matching/**

**/segment/based/matching/News/get/5**:

The above URI can be broken down:

* **/segment/based/matching/** - prepend, ignored
* **News** - Controller name
* **get** - Method name
* **5** - First and only parameter

The Router will now attempt to instantiate the **\App\Controller\News** controller
and call its **get** method with **5** as a parameter value.

**/segment/based/matching/News**

The above URI can be broken down:

* **/segment/based/matching/** - prepend, ignored
* **News** - Controller name

The Router will again attempt to instantiate the **\App\Controller\News** controller
and call the **index** method, as none was supplied by the URI, and it is set up
as the default method.

**/News/save/6**

The Above URI will not match, because it does not begin with the required prepend.

.. WARNING::
   If a Route is defined that matches the incoming request, that route will be used
   instead. Segment-based URI matching is used only if the incoming request does
   not match a defined Route!
