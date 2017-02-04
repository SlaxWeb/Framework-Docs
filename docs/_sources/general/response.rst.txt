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

discardResponseOnExit
'''''''''''''''''''''

* Data type: **bool**
* Default: **false**

All data set to the *Response* object or the *Output* component is discarded if
execution is abruptly terminated by calling *exit* in application code, unless the
*Output* component is enabled and *discardResponseOnExit* is set to bool(**false**).

.. _gen topics response output conf mode:

defaultOutputMode
'''''''''''''''''

* Data type: **int** - constants
* Default: **Output::MODE_JSON** - 1

Defines the default mode in which the Output component operates. See :ref:`gen topics
response output mode` for a list of available values.

permitModeChange
''''''''''''''''

* Data type: **bool**
* Default: **true**

Defines if the Output mode may be changed once it has already been set manually.
Applies only after the mode has been changed first.

.. _gen topics response output mode:

Output modes
````````````

Output component supports multiple output modes:

* View/Template output - *Output::MODE_VIEW* - int(0)
* JSON output - *Output::MODE_JSON* - int(1)
* File output *(not yet supported)* - *Output::MODE_FILE* - int(2)

The **View/Template output** mode is enabled as soon as a View object is added to
the Output object. This mode will render the added views as they are added. More
information can be found bellow in :ref:`gen topics response rendertpl`.

The **JSON output** mode can be enabled by explicitly calling the **jsonMode** method
on the Output object. JSON output data is then accessed over the public *json* property
of the Output object. For more information refer to the :ref:`gen topics response
json` section bellow.

A default mode may be configured in the configuration as well. See :ref:`gen topics
response output conf mode`.

.. _gen topics response rendertpl:

View/Template output
````````````````````

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

addView
'''''''

*addView* will add the View object to the internal list of Views, and set the output
mode to **View/Template output**. The Output component will automatically render
the Views added with this method in the same order, if the mode is still set to
the *View/Template* mode.

Example usage::

    <?php
    // load View \App\View\MyView
    $myView = $app["loadView.service"]("MyView");
    $app["output.service"]->addView($myView);

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
    $app["output.service"]->addView($myView);

    // load View \App\View\SpecialView
    $specialView = $app["loadView.service"]("SpecialView");
    $app["output.service"]->addView($specialView);

    // add data
    $app["output.service"]
        ->addData(["foo" => "bar"])
        ->addData(["baz" => "qux"], \App\View\SpecialView::class);

In the above example, the variable *foo* will be available in both views, while
the variable *baz* will be available only in the *SpecialView*.

.. _gen topics response json:

JSON output
```````````

The **JSON output** mode is enabled by default through configuration, or it can
be enabled manually by calling the **jsonMode** method on the Output object. When
in JSON mode, the Output component will automatically set the appropriate headers
for this mode.

The Output object uses an external **JSON Handler** class for output data manipulation.
The handler class implements the **\SlaxWeb\Output\Interfaces\JsonHandler** interface
that defines the required methods for adding data, errors, and serialization to
JSON.  The **\SlaxWeb\Output\Handler\Json** class is also provided that implements
the interface. If additional functionality or structure is required the existing
handler may be extended, or a completely new one may be defined, as long as it is
exposed to the DIC with the **jsonOutputHandler.service** name, and it implements
the above interface.

The default handler serializes the data and error arrays to the following basic
JSON structure:

.. code-block:: javascript

    {
        "data": [],
        "error": []
    }

The JSON Handler is available through the **json** property in the Output object.

jsonMode
''''''''

When the **jsonMode** method is called, the Output objects output mode is set to
**JSON output**.

addData
'''''''

Add an array of data to the handler that will be serialized to the *data* part of
the JSON in output. Example::

    <?php
    $app["output.service"]->json->addData(["foo" => "bar"]);

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
    $app["output.service"]->json->addError("Not permitted", 403);

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

Error output
````````````

.. NOTE::
   Not implemented yet. Planed for future releases.
