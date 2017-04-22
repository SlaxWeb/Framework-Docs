.. SlaxWeb Framework General Topics - Views & Templates file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics viewtpl:

Views & Templates
=================

Templates are the visual side of your application, they define the look & feel of
your application, while Views are the ones controlling the Templates. They obtain
data, merge it with the data it received through other channels, and render the
Template with the help of the templating engine.

To use Views & Templates, you need to extend the functionality of the Framework.
SlaxWeb provides an installable component called **view** for this exact purpose.
It comes with a sub-component that exploits the `Twig Templating Engine <http://twig.sensiolabs.org/>`_
to help with the Template rendering, however, it is not required, as the main **view**
component uses plain PHP Templates. To Use the Twig Templating Engine, just install
the **view-twig** sub-component when asked during installation of the **view** component,
and refer to the Twig documentation for use.

To install the **view** component use the :ref:`gen topics slaxer` command line
tool::

    ./slaxer component:install view

And follow the on-screen instructions.

The View
--------

As outlined above, a View is the one controlling the Templates, it is sort of a
presenter for the Templates, as it obtains and prepares the data for the Template
and renders and outputs the rendered Template. Therefore, a View is a PHP class,
that has to extend from the **\\SlaxWeb\\View\\Base** class. The Base View already
provides all the necessary functionality for rendering of the Template.

The constructor of the Base View requires the configuration object, template loader
class, and the response object. Base View also sets the base directory of the templates,
which is controlled by the **baseDir** configuration option found in the **view.php**
configuration file. The base directory is the directory where all the template files
are located, be in it directly or in subdirectories.

Loading the View
````````````````

The View component provides a View Loader service, available with the **loadView.service**
in the :ref:`gen topics application`.  It takes 2 parameters, the first is the name
of the View that you want loaded, and the second if the loader should attempt to
inject the loading Views template into a :ref:`gen topics viewtpl layout` template
automatically, which it attempts to do by default.

Example::

    <?php
    // ...
    $view = $application["loadView.service"]("My/View");
    // ...

This will attempt to instantiate the **\\App\\View\\My\\View** class, and return
it to you, so you may add more data to it, or trigger the rendering of the template.
Read on to find out more about Views.

If the second parameter is omitted and **defaultLayout** in the **view.php** configuration
file is set, the loader will attempt to load the :ref:`gen topics viewtpl layout`
View and already set it to your View as the Layout.

.. _gen topics viewtpl avoid view:

Avoiding the View class
''''''''''''''''''''''''

The View Class can be avoided completely if it is not required, and the only purpose
is to load a template that will require no upfront preparation of view data. The
View component already provides the *Base* View Class which already holds all the
necesarry functionality to properly load and render the desired template. To load
a Template without creating a View Class the :ref:`gen topics application` provides
a **loadTemplate.service** which can be used just as the **loadView.service**::

    <?php
    // ...
    $view = $application["loadTemplate.service"]("My/View");
    // ...

Loading the template directly will instantiate the **\\SlaxWeb\\View\\Base** class
and set the template to its object. Further operations remain all the same, the
Template still has to be rendered manually or with the :ref:`gen topics response
output`.

Setting the template
````````````````````

To set the template name, you can populate the **template** class property. If the
template name is not set when the View that is extending the Base View is being
constructed, the Base View will set the template name automatically, based on the
View class name, if the **autoTplName** configuration option is set to *true*.

When automatically setting the template name, the **classNamespace** is removed
from the full class name, and the namespace delimiters are converted to forward
slashes.

In the following example, the **classNamespace** in the configuration is still
set to *\\\\App\\\\View\\\\* and the Views full class name is *\\App\\View\\User\\Login*.
In this case, the View will look for the **user/login.php** template file in the
**app/Template/** directory, if it has not been changed in the **baseDir** configuration
option. If you are using the **view-twig** sub-component, then the file extension
of the template file will be *.html* instead of *.php*.

.. _gen topics viewtpl viewdata:

View data
`````````

View data can be added to the view in multiple ways. The first and simplest way
is to pass an associative array of data to the **render** method as the first parameter
when rendering the view. The second way is to set it directly to the internal **viewData**
property, and the third, is to set it in the View class itself.

The View data is then injected into the Template, in the plain PHP templates, that
data is then simply available as PHP variables, and if using the **view-twig** sub-component,
as Twig variables.

The View data must be an associative array, as the key names become the variable
names in the Template itself.

Rendering the template
``````````````````````

To render the template, you have to call the **render** method. The **render** method
looks for a **preRender** method in your view class, and if it is found, it will
be executed with the passed in view data array as the only parameter. Use the **preRender**
method to obtain the final pieces of data that the Template requires, or prepare
the data right before rendering.

The **render** method takes 3 optional parameters:

* :ref:`gen topics viewtpl viewdata` - **array** - *See above*

* Return - **integer** - determines if the rendered template should be returned
  to the caller or output. Default is to output. Available options:

  * *\\SlaxWeb\\View\\AbstractLoader::TPL_RETURN* - 200 - Return rendered template,
    **default**
  * *\\SlaxWeb\\View\\AbstractLoader::TPL_OUTPUT* - 201 - Output rendered template

* Cache variables - **integer** - determines if the view variables should be cached,
  if previously cached variables should be used, or if only current supplied variables
  should be used. The component provides the following constants for this:

  * *\\SlaxWeb\\View\\AbstractLoader::TPL_CACHE_VARS* - 100 - Use cached variables
    and add new variables to cache, **default**
  * *\\SlaxWeb\\View\\AbstractLoader::TPL_USE_VARS_ONLY* - 101 - Use cached variables,
    but do not add new variables to cache
  * *\\SlaxWeb\\View\\AbstractLoader::TPL_NO_CACHE_VARS* - 102 - Do not use cached
    variables, and do not add new variables to cache

Templating
----------

The View component, regardless of sub-components provides you with two options of
advanced templating. A simple template is a single file, but those are not particularly
useful in real-life application. In a real-life application you need to combine
several templates for one application page. To help you do so, the View component
provides the *Sub View* and *Layout* functionality.

Sub-Views
`````````

A Sub View is basically a view, being injected into the main view. In order to use
a view as a Sub View, you first need to load its View class just as if it is a normal
view, and then pass the object of that Sub View into the main views **addSubView**
method, where the first parameter is the name of the Sub View, and the second parameter
is the actual Sub View object. In the following example, we will load the login
sub-view into the homepage view::

    <?php
    // ...
    $subView = $application["loadView.service"]("Login");
    $homepage = $application["loadView.service"]("HomePage");
    $homepage->addSubView("login", $subView)->render();

The Sub View is then rendered before the main view, and it is injected into the
main views parameters with the **subview_** prepending the name of the Sub View.
In our example the Sub View would be available in the **subview_login** template
variable.

Multiple Sub Views added to the main view are concatenated into the same template
variable in the order that they were added.

Sub-Templates
'''''''''''''

Sub Templates are the same as the Sub Views, except they do not require their own
View class, since they reuse the already available base View class **\\SlaxWeb\\View\\Base**.
This makes loading simpler and faster since you do not need to invoke the View loader
service to load a view, and instantiate a class. Example::

    <?php
    // ...
    $homepage = $application["loadView.service"]("HomePage");
    $homepage->addSubView("login", "Login")->render();

Code is also a bit shorter, and there is no need to create an empty View class just
to load a simple Sub Template. They are loaded into the same View variable, so the
above example will also be available as **subview_login** in your main template.

.. _gen topics viewtpl layout:

Layouts
```````

Layouts, while technically still the same as regular Views, are wrappers for your
templates, that never change, and just present different kind of content. A layout
would normally contain the HTML head definitions, and so on, and dedicate a certain
area as to where the rendered view will be injected.

When the main view is rendered it is injected into the layout template file with
the **mainView** template variable. To use a layout on a template its View class
object needs to be added to the view with the **setLayout** method. In the following
example we will load the homepage view, and use the *DefaultLayout* as the layout::

    <?php
    // ...
    $layout = $application["loadView.service"]("DefaultLayout");
    $homepage = $application["loadView.service"]("HomePage", false);
    $homepage->setLayout($layout)->render();

As you can see, we use the View Loader service to load the Layout View class, just
as if loading a regular view. The Layout View in fact is just a regular view, what
makes it a layout is the way we use it. The main view will then render the main
view, store it in a variable, and inject it into the layout view before rendering
the layout template.

Default layout
''''''''''''''

In the **view.php** configuration file a default layout may be set. If a default
layout is set, and the second parameter to the **loadView.service** or the **loadTemplate.service**
is omitted or set to *true*, the loader will automatically load and set the default
layout for that view.

Layout View
'''''''''''

Just as by normal templates, the View class can be omitted for the Layout Template.
If the loader does not find the Layout View Class it will use the **\\SlaxWeb\\View\\Base**
class as the View class. If special processing is required for the layout template
then a class with the same name must be found in the **classNamespace**(**view.php**)
defined namespace.
