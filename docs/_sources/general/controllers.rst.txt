.. SlaxWeb Framework General Topics - Controllers file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics controller:

Controllers
===========

Controllers are meant to handle user input, population of models and libraries with
required data, manipulating views, and so much more. However, in SlaxWeb Framework,
a controller is not required for every request, and can be bypassed on requests
where there is no user interaction, or the request is loading a simple view. If
you have enabled :ref:`gen topic routing segmentbased` then a Controller is required
as the Framework will load it for every request that is matched through segment-based
URI matching.

Loader
------

.. ATTENTION::
   The Base Controller and the Loader do not exist yet. They are planned for version
   0.5.0.

The Controller Loader is a Framework registered service, that will instantiate your
Controller class, and call an existing **init** method if it exists in your Controller
with all additional input parameters. It passes the :ref:`gen topics application`
to the constructor of the Controller class. To use the Loader simply access the
**loadController.service** in the Application object, and pass it the Controllers
name as the first input parameter. Any further parameters will be passed to the
**init** method of the Controller if it exists. Example Controller class::

    <?php
    namespace App\Controller;

    class MyController extends \SlaxWeb\Framework\BaseController
    {
        protected $param = "";

        public function init(string $param)
        {
            $this->param = $param;
        }
    }

To load this Controller with a loader, you simply execute the following in your
Route definition::

    $controller = $application["loadController.service"]("MyController", "param value");

This way, your controller is loaded fully instantiated, and your custom initialisation
method has been executed with the required parameters.

Using the Controller
--------------------

The Controller being a regular class, there really are no limitation as to how one
might use it, however, there are certain recommendations on dos and dont's for the
Controllers. A couple of them are outlined bellow:

* **Do not mix Controllers, or call one from another** - A Controller should represent
  a single *activity* in your application. It may sound as a good idea to mix the
  **User** Controller and the **Post** Controller at first, but you really should
  not. Any functionality that should or must co-exist between them should be done
  in a model and/or library. **Post** Controller should not have to check if a user
  is logged in through a **User** Controller, but rather do so directly through
  the **Authentication** Library.
* **No output from controllers directly** - A Controller should do just what its
  name suggest, control the flow of the application and should as such not output
  anything directly.
* **Validate data** - Use the Controller to validate user input before using it
  elsewhere in the application.
* **Populate models/libraries with user data** - After the Controller validates
  user data, it should populate models and/or libraries with that data where applicable
  and begin processing of said data with the help of the models and/or libraries.
