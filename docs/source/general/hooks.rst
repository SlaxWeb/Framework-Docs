.. SlaxWeb Framework General Topics - Hooks file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics hooks:

Hooks
=====

Hooks allow you to tap into existing application code, change its data and/or flow
based on some condition, or just execute additional code at pre-defined points in
code called *hook points*. The SlaxWeb Framework Hooks system allows you to alter
execution of its own core, as well as permits you to exploit that same functionality
in your own code, by implementing your own hook points.

The Hook system is part of the SlaxWeb Framework core and does not require any additional
installation of any component and is ready to use out of the box.

Writing hook points
-------------------

To define a hook point in your code, all you have to do, is come up with a unique
hook name, and call the **exec** method on the Hook service object::

    <?php
    // ... code ...
    $application["hooks.service"]->exec("my.unique.hook");
    // ... code ...

When execution reaches this point in your code, the Hook service object will execute
all Hook Definitions for that hook points name. If you wish to pass any further
parameters to the hook definition, then you may simply add more of them to the **exec**
method call. Be aware, that the Hook Definition may implement a pass-by-ref on those
parameters, and change them, so pass along only parameters that you want to permit
to be changed::

    <?php
    // ... code ...
    $data = ["foo" => "bar"];
    $application["hooks.service"]->exec("my.unique.hook", $data);
    // ... code ...

If the Hook Definition connected to that hook point will accept the *$data* array
as pass-by-ref, then the Hook Definition can change that array. Whatever the Hook
Definition returns, will be returned by the **exec** method, so you can use that
as well for the two-way communication between the piece of code that executes a
hook point, and the Hook Definition::

    <?php
    // ... code ...
    if ($application["hooks.service"]->exec("my.unique.hook") === true) {
        // handle this situation
    } else {
        // handle it differently
    }
    // ... code ...

Writing Hook Definitions
------------------------

To write a Hook Definition, or to attach your code to a hook point, you need to
create a class that extends from the **\\SlaxWeb\\Hooks\\Service\\Definition** parent
class. The Framework provides a directory, **app/Hook/** and a namespace **\\App\\Hook\\**,
for you to simplify this process.

In this class you have to define a **define** method, and in this method you can
write your Hook definitions. In the next example, we will write a simple Hook definition
for the **application.init.after** hook point::

    <?php
    namespace App\Hook;

    use SlaxWeb\Bootstrap\Application as App;

    class MyHooks extends \SlaxWeb\Hooks\Service\Definition
    {
        public function define()
        {
            $this->hooks["application.init.after"] = function(App $app) {
                // hook definition code
            };
        }
    }

As seen above, you need to add a hook definition to the internal *hooks* associative
array, with the name of the hook as the array key, and the defining function as
the array value.

When your Hook Definition is executed, the Hook object will automatically inject
the :ref:`gen topics application` into your Hook Definition function, and thus you
can typehint for it. A hook point may however call the definitions with further
parameters, those are then passed into your Hook Definition in the same fashion,
and the order as the hook point *exec* is called.

Register Hook Definitons
````````````````````````

Now that the Hook Definitions are defined in the Hook Definition class, it needs
to be registered with the Framework. To do so, add the full class name of the Hook
Definition class to the **hooksList** configuration item in the **app/Config/app.php**
configuration file.

Multiple Hook Definitions
`````````````````````````

A single hook point can have multiple Hook Definitions attached to them, and the
Hook component will execute all definitions one after another, in the same order
as they are defined.

When multiple Hook Definitions are returning values, then all return values are
gathered in an array, and that array is returned from the **exec** method.

A Hook Definition can also stop execution of further Hook Definitions for that hook
point by calling the **stopExec** method on the Hook service from the Hook Definition
function::

    <?php
    // ...
        $this->hooks["application.init.after"] = function(App $app) {
            // hook definition code

            $app["hooks.service"]->stopExec();

            // hook definition code
        };
    // ...

Framework hooks points
----------------------

Here you can find the list of all the Framework hook points in the order as they
are executed:

* *application.init.after* - Executed at the end of the :ref:`gen topics application`
  **init** method call
* *application.dispatch.before* - Executed before the request is sent over to the
  :ref:`router component`
* *router.dispatcher.routeNotFound* - Executed only if a matching Route is not found
  by the :ref:`router component`
* *router.dispatcher.beforeDispatch* - Executed when the :ref:`router component`
  has already found a matching Route, but has not executed it yet
* *router.dispatcher.afterDispatch* - Executed after user defined code for the Route
  has been executed
* *application.dispatch.after* - Executed after the request dispatching, and after
  Route user code execution

A more detailed list of hook points can be found in each component documentation.
