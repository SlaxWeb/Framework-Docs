.. SlaxWeb Framework General Topics - Handling responses file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics response:

Handling responses
==================

The SlaxWeb Framework uses the robust *Request* and *Response* classes of the `Symfony
Http Foundation <http://symfony.com/doc/3.0/components/http_foundation.html>`_ component
to handle incoming requests and outgoing responses. The framework however provides
an extension to the Response class to simplify a few tasks when returning data to
the caller. Some extensions come in the form of the extended *Response* class of
the framework itself, and those can be used as simply as other Symfony Http Foundation
Response object functionality.

Other extensions come in the form of an **Output** SlaxWeb Framework component,
which is installed by default but not activated. The Output component helps with
outputting data from views, JSON data structures, and files.

Response object extensions
--------------------------

Bellow is the functionality that is not found in the original *Response object*
of the *Symfony Http Foundation* in this particular form, or what can not be used
as such directly.

addContent
``````````

Add content is used just as the original `setContent <http://api.symfony.com/3.0/Symfony/Component/HttpFoundation/Response.html#method_setContent>`_
only that it does not truncate the previously set content, but instead appends the
new content to the previously existing content.

redirect
````````

In the original *Response* component of the *Symfony Http Foundation* means creating
a new response object, and using this object to sent the output. This does not work
in the SlaxWeb Frameworks architecture. Therefor the extension of the *Response
object* provides a **redirect** method which takes an URI or full URL as input and
redirects the user to that address. The second parameter dictates if the user should
be redirected immediately or at the end of execution of the request::

    <?php
    $app["response.service"]->redirect("/some/uri");
    echo "this will no longer be executed";

If you wish to permit the rest of the execution to finish, pase *bool(false)* as
the value of the second parameter::

    <?php
    $app["response.service"]->redirect("https://google.com", false);
    echo "this will still run";

.. _gen topcis response output:

Output component
----------------

.. ATTENTION::
   This has not yet been implemented, and this documentation is the second draft
   of the *Output component*. End implementation may be done differently, and there
   is no guarantee that it will function in compliance to this documentation. First
   draft on *Output component* can be found `here <https://github.com/SlaxWeb/Framework/wiki/Documentation#13-output>`_.

The Output component helps with managing the output from your application, by setting
the correct response codes, content type, and so on. It is disabled by default,
and should be enabled in its configuration file **output.php** which can be found
in the default configuration directory, **app/Config/**.

The Output component is exposed to the DIC under the **output.service** name.

Configuration
`````````````

Apart from enabling and disabling the Output component, the configuration file allows
you to control general output in your application. The following configuration options
are available:

enable
''''''

* Data type: **bool**
* Default: **false**

Enables or disables the Output component, and must be set to bool(**true**) in order
to enable the component.

permitDirectOutput
''''''''''''''''''

* Data type: **bool**
* Default: **true**

If this configuration option is set to bool(**false**) the Output component will
discard any direct output from your application that is not set to the *Response
object* or the Output component.

.. WARNING::
   Setting this to bool(**false**) will prevent **ALL** direct output, including
   PHP error messages. This is **NOT** recommended for a development environment!

.. _gen topics response output default handler:

defaultHandler
''''''''''''''

* Data type: **string**
* Default: **view**

Defines the Output Handler for the Output Manager. The Output component comes with
existing handlers, but you may use your own. If you wish to use your own just set
the full class name of your handler bellow, or the name of the service if you have
registered it with the Application instance, or choose one pre-existing handler
from the list found in the :ref:`gen topics response output handlers` section of
the documentation bellow.

.. NOTE::
   This can be overriden during runtime by setting the "outputHandler" application
   property.

.. _gen topics response output handlers:

Output handlers
```````````````

.. NOTE::
   File output handler is not yet available and is planned for future releases.

Output component uses Output handlers to handle different types of output. The component
comes with 3 handlers predefined:

* **view**
* **json**
* **file**

To define a handler for the component it can be set using the :ref:`gen topics reponse
output default handler` configuration option or by setting it to the **outputHandler**
application property. The above options will load the following service into the
Output component:

* Option *view*: **outputViewHandler.service**
* Option *json*: **outputJsonHandler.service**
* Option *file*: **outputFileHandler.service**

To use a custom output handler a custom class may be defined, as long as it extends
the **\\SlaxWeb\\Output\\AbstractHandler** abstract class and define a **render**
method that will return a *string* that will be added to response content. To use
the custom class, either set the name of the custom class to the :ref:`gen topics
response output default handler` configuration option, or the **outputHandler**
application property. You can also pass the name of a custom service providing the
custom handler class, or extend/override an existing service defined above.

.. _gen topics response rendertpl:

View handler
````````````

The **View handler** is enabled by setting the :ref:`gen topics response output
default handler` configuration option to **view** or by setting the same value to
the **outputHandler** application property.

Rendering templates is not a particularly hard task in the SlaxWeb Framework. You
initialize the View with the help of the view loader service, call render method
with the desired view data, or pass it to the *View object* directly, and the rendered
template is set to the *Response object*, and the rendered template is output at
the end of execution.

But when your application relies on multiple views in one request, this can become
quite a task, since you need to either pass around all the templates in your application
to set the view data to each view, even when that view data is almost the same in
all the views, or you pass around the first view to be rendered, and let view data
caching handle populating data to the next rendered views. This is where the **Output**
component steps in, you simply add your views to the **Output** object, and add
view data directly to the **Output** object, and have it handle everything for you.

add
'''

*add* will add the View object to the internal list of Views, if the **view** output
handler is set in the configuration option or the **outputHandler** application
property. The Output component will automatically render the Views added with this
method in the same order.

Example usage::

    <?php
    // load View \App\View\MyView
    $myView = $app["loadView.service"]("MyView");
    $app["output.service"]->add($myView);

addData
'''''''

The *addData* method accepts an array of data as input. Each time data is added,
the arrays are merged together using the *array_merge* PHP function. The second
parameter may define the full class name, including namespace, of a View, and the
data will be used only for that View.

Example usage::

    <?php
    // load View \App\View\MyView
    $myView = $app["loadView.service"]("MyView");
    $app["output.service"]->add($myView);

    // load View \App\View\SpecialView
    $specialView = $app["loadView.service"]("SpecialView");
    $app["output.service"]->add($specialView);

    // add data
    $app["output.service"]
        ->addData(["foo" => "bar"])
        ->addData(["baz" => "qux"], \App\View\SpecialView::class);

In the above example, the variable *foo* will be available in both views, while
the variable *baz* will be available only in the *SpecialView*.

.. _gen topics response json:

JSON handler
````````````

The **JSON handler** is enabled by setting the :ref:`gen topics response output
default handler` configuration option to **json** or by setting the same value to
the **outputHandler** application property.

The Output handler sets the **application/json** Content-Type for the Response object.

The default handler serializes the data and error arrays to the following basic
JSON structure:

.. code-block:: javascript

    {
        "data": [],
        "error": []
    }

The JSON handler has the following properties which can be used to add data and
error messages to the JSON response.

add
'''

Add an array of data to the handler that will be serialized to the *data* part of
the JSON in output. Example::

    <?php
    $app["output.service"]->add(["foo" => "bar"]);

The above code will produce the following output:

.. code-block:: javascript

    {
        "data": {
            "foo": "bar"
        },
        "error": []
    }

addError
''''''''

Add error will add the error message to the *error* array of the output JSON and
automatically set the response HTTP Status code, to 500 *Internal Server Error*
by default. The second parameter can override this, by specifying a different HTTP
Status code. Example::

    <?php
    $app["output.service"]->addError("Not permitted", 403);

The above code will produce the following output:

.. code-block:: javascript

    {
        "data": [],
        "error": [
            "Not permitted"
        ]
    }

In addition to the output JSON, the response HTTP Status code will be set to 403
*Forbidden*.
