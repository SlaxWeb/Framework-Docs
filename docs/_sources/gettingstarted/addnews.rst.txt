.. SlaxWeb Framework addnews file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _add news article:

Add news article
================

Because adding HTML articles by hand into a database can be annoying, and error
prone, we are going to create a simple page that will allow you to type in the title
of the news, and the body's HTML and save as new news article into the database.
Of course, by providing only a normal HTML input, the method will not be less error
prone, but you are free to replace a text HTML editor with a wysiwyg editor of your
choosing. We will require a route for this page, that will handle both displaying
of the page and saving the news data to the database. To display a page, we will
not need a *Controller* but we will need one for saving the data into the database.

Setting up the route
--------------------

We are going to define one route that will handle both displaying of the page, as
well as saving the data into the database. We will display the page through HTTP
method GET, and save data through HTTP method POST. Let's go ahead and create it::

    $this->_routes[] = [
        "uri"       =>  "news/create",
        "method"    =>  Route::METHOD_GET | Route::METHOD_POST,
        "action"    =>  function (
            Request $request,
            Response $response,
            Application $app
        ) {
            $view = $app["loadView.service"]("CreateNews");
            if ($request->getMethod() === "POST"
                && (new \App\Controller\News($app["loadModel.service"]("News")))
                    ->save($request->request, $response, $view)
            ) {
                return;
            }
            $view->addSubView("head", $app["loadView.service"]("Head"))
                ->addSubView("foot", $app["loadView.service"]("Foot"))
                ->render();
        }
    ];

You have to make sure that the *create news* route is defined **before** the single
news page, because the *news/create* URI will be matched by *news/[:params:]* first,
and we do not want that, because we want to show the *create news* page. Our Route
will also handle saving of news data into the database, and will not render any
view, since we will use the Controller to save the data and redirect the user to
the newly created news article.

Template and View
-----------------

Now lets go ahead an prepare the **CreateNews.php** template file which will provide
a HTML form with the title input, and the article body text area::

    <?= $subview_head; ?>
    <div class="create-news-container">
        <h1>Create news article</h1>
        <div class="error" style="color:red"><?= $error; ?></div>
        <form action="/news/create" method="POST">
            <div class="row">
                <label for="news-title">Title:</label>
                <input type="text" name="title" id="news-title" value="<?= $title; ?>">
            </div>
            <div class="row">
                <label for="news-body">Body:</label>
                <textarea name="body" id="news-body"><?= $body; ?></textarea>
            </div>
            <input type="submit" value="Save">
        </form>
    </div>
    <?= $subview_foot; ?>

As you can see, we are also printing a *$title* and a *$body* onto the Template
already, those are there in case an error occurs while saving the article, and we
can refill the fields as well as show an error. Those are only set when an attempt
to save the article is made, so the *View class* will have to set empty ones in the
**preRender** method if they are not yet set. Let's go ahead and create the **CreateNews**
View Class::

    <?php
    namespace App\View;

    use SlaxWeb\View\Base as BaseView;

    class CreateNews extends BaseView
    {
        public function preRender(array $data)
        {
            $this->viewData["error"] = $this->viewData["error"] ?? "";
            $this->viewData["title"] = $this->viewData["title"] ?? "";
            $this->viewData["body"] = $this->viewData["body"] ?? "";
        }
    }

Saving the article
------------------

We have everything prepared and so we can define the **save** method in the **News**
Controller class::

    public function save(Params $parameters, \SlaxWeb\Router\Response $response, \App\View\CreateNews $view): bool
    {
        $title = $parameters->get("title");
        $body = $parameters->get("body");
        if (is_empty($title) || is_empty($body)) {
            $view->viewData["error"] = "News article data is not valid.";
            $view->viewData["title"] = $title;
            $view->viewData["body"] = $body;
            return false;
        }
        if ($this->newsModel->create($parameters->all())) {
            $view->viewData["error"] = "Error saving news article: " . $this->newsModel->lastError();
            $view->viewData["title"] = $title;
            $view->viewData["body"] = $body;
            return false;
        }
        $response = $response->redirect("/news");
        return true;
    }

The Controller just makes a quick check if the article title and body have been
set in the request data, and triggers an error if they are not. In a real world
application you will want to use a proper validation here. If the data checks out,
we simply create a new row in the database, and when no error has occurred we redirect
the visitor to the news listing page. If an error occurs, then it is presented on the
web page.
