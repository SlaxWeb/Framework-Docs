.. SlaxWeb Framework addnews file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

Edit news article
=================

Because mistakes can be made when creating a news article, we need an edit functionality
so that news articles can be edited. For this, we will re-use the create news article
template, and define a new controller method to handle the saving of the edited
news article.

Setting up the route
--------------------

As same as with the :ref:`add news article` page, we will also use one route to
handle both the display of the edit page, as well as handle the editing itself::

    $this->_routes[] = [
        "uri"       =>  "news/[:params:]/edit",
        "method"    =>  Route::METHOD_GET | Route::METHOD_POST,
        "action"    =>  function (
            Request $request,
            Response $response,
            Application $app
        ) {
            $newsModel = $app["loadModel.service"]("News");
            $newsView = $app["loadView.service"]("CreateNews", $newsModel);
            $newsController = new \App\Controller\News($newsModel);
            if ($request->getMethod() === "POST"
                && $newsController->edit($request, $response, $newsView)
            ) {
                return;
            }
            $newsController->loadEdit($request->query, $newsView);
            $newsView->addSubView("head", $app["loadView.service"]("Head"))
                ->addSubView("foot", $app["loadView.service"]("Foot"))
                ->render();
        }
    ];

We have the route prepared, and as you can see we will just re-use a lot of the
code in already written in the Controller and the View, for which we will only need
to make minor adjustments.

Preparing the View
------------------

We already have the Template ready as we need it. It is already made so it presents
data if it is set from the ref:`add news article` section. We will just need to
extend the View class to obtain the data from the model and set it to view data
before it is rendered. We need to make sure that the *model* is optional, since
we are using the same View for the Create News Article page, which does not require
a model::

    protected $newsModel = null;

    public function init(\App\Model\News $newsModel = null): CreateNews
    {
        $this->newsModel = $newsModel;
        return $this;
    }

    public function preRender(array $data)
    {
        if ($this->newsModel !== null && isset($this->viewData["error"]) === false) {
            $article = $this->newsModel->select(["title", "body"]);
            if ($article->row(1)) {
                $this->viewData["title"] = $article->title;
                $this->viewData["body"] = $article->body;
            }
        }

        $this->viewData["error"] = $this->viewData["error"] ?? "";
        $this->viewData["title"] = $this->viewData["title"] ?? "";
        $this->viewData["body"] = $this->viewData["body"] ?? "";
        $this->viewData["actionUrl"] = $this->viewData["actionUrl"] ?? "/create/news";
    }

We are assigning the *News Model* object to the *View Class* properties in the *init*
method, and we have extended the **preRender** method, to obtain the news article
data from the *News Model* before the page is being rendered. We could theoretically
already begin editing, but we need to make two slight alterations. One is to add
a link to the edit page into the single page Template **SingleNews.php**::

    <div class="news-article">
        <h1><?= $article->title; ?></h1>
        <p><?= $article->body; ?></p>
        <span class="edit-link"><a href="/news/<?= $article->id; ?>/edit">Edit</a</span>
    </div>

And in order for our form to properly send the edit and save POST requests, we will
need to dynamically set it in the Controller as view data and print it out in the
Template file **CreateNews.php**::

    <form action="<?= $actionUrl; ?>" method="POST">

Preparing the controller
------------------------

To prepare the controller we are first going to create a **loadEdit** method in
the **News** controller that will validate the news ID and set the required data
to the model as a where predicate::

    public function loadEdit(Params $parameters, \App\View\CreateNews $newsView)
    {
        $params = $parameters->get("parameters");
        if (isset($params[0]) === false || is_numeric($params[0]) === false) {
            $newsView->viewData["error"] = "News ID not defined or not a valid ID";
            return;
        }

        $this->newsModel->where("id", (int)$params[0]);
        $newsView->viewData["actionUrl"] = "/news/{$params[0]}/edit";
    }

Saving updated news article
```````````````````````````

Now that we have loaded the news article into the view for editing, we need to save
the changes into the database. To do so, we will require a Controller method, that
will save the news with the help of the *News Model*::

    public function edit(
        \SlaxWeb\Router\Request $request,
        \SlaxWeb\Router\Response $response,
        \App\View\CreateNews $view
    ): bool {
        $id = $request->query->get("parameters");
        if (isset($id[0]) === false || is_numeric($id[0]) === false) {
            $newsView->viewData["error"] = "News ID not defined or not a valid ID";
            return false;
        }
        if (is_empty($title) || is_empty($body)) {
            $view->viewData["error"] = "News article data is not valid.";
            return false;
        }
        if ($this->newsModel->where("id", $id[0])->update($request->request->all())) {
            $view->viewData["error"] = "Error saving edited news article: " . $this->newsModel->lastError();
            return false;
        }
        $response = $response->redirect("/news/{$id}");
        return true;
    }

And there we go, we can now successfully edit a news article and save it to the
database.

This concludes this simple guide, and the code and methods that you have seen here
are certainly not the only way, nor the best way to go about writing applications,
it is only meant as a guide to introduce you to the SlaxWeb Framework. There are
still a lot of things to explore. We suggest you head to ref:`components` part of
the documentation to explore further.
