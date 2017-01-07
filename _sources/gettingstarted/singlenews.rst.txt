.. SlaxWeb Framework newslisting file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

Single news page
================

The Single News Page will be only an extension to the already existing :ref:`guide newslist`.
We will however need a new route, a *Controller*, and we will also create a new
*Template* file to achieve this, and instruct the existing *NewsList* View Class
to load this new template instead. Let's dig in!

Creating the controller
-----------------------

First we are going to create a controller, that will retrieve the input parameter,
validate it, and pass it to the model::

    <?php
    namespace App\Controller;

    use App\Model\News as NewsModel;
    use App\View\NewsList as NewsView;
    use Symfony\Component\HttpFoundation\ParameterBag as Params;

    class News
    {
        protected $newsModel = null;

        public function __construct(NewsModel $newsModel)
        {
            $this->newsModel = $newsModel;
        }

        public function loadNews(Params $parameters, NewsView $newsView)
        {
            $newsView->template = "SingleNews";
            $params = $parameters->get("parameters");
            if (isset($params[0]) === false || is_numeric($params[0]) === false) {
                $newsView->viewData["error"] = "News ID not defined or not a valid ID";
                return;
            }

            $this->newsModel->where("id", (int)$params[0]);
        }
    }

Our controller depends on the *News Model* and the *News View*. It parses the input
parameter, and if the parameter is not found or is not numeric an error is set directly
to the view data. If the input parameter validates, then we set the ID to the Models
where statement and that is all from the controllers side, we will let the View
Class obtain the data from Model, and fill it into view data as with News Listing.

Create the template
-------------------

The Single News page will be slightly different, but in this guide, we can simply
re-use the already existing *NewsList* View Class, so lets just create a new **SingleNews.php**
template file::

    <?= $subview_head; ?>
    <div class="news-container">
        <?php if (isset($error)): ?>
            <div class="error" style="color:red"><?= $error; ?></div>
        <?php else: ?>
            <?php foreach ($newsArticles as $article): ?>
                <div class="news-article">
                    <h1><?= $article->title; ?></h1>
                    <p><?= $article->body; ?></p>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
        <a href="/news">Back</a>
    </div>
    <?= $subview_foot; ?>

The Route
---------

We still need to take care of the Route of our single news page::

    $this->_routes[] = [
        "uri"       =>  "news/[:params:]",
        "method"    =>  Route::METHOD_GET,
        "action"    =>  function (
            Request $request,
            Response $response,
            Application $app
        ) {
            $newsModel = $app["loadModel.service"]("News");
            $newsView = $app["loadView.service"]("NewsList", $newsModel);
            (new \App\Controller\News($newsModel))
                ->loadNews($request->query, $newsView);
            $newsView->addSubView("head", $app["loadView.service"]("Head"))
                ->addSubView("foot", $app["loadView.service"]("Foot"))
                ->render();
        }
    ];

Note the URI now contains a *[:params:]*, which means that all URI sections will
be converted to a parameters array, which we retrieved with the *$request->query->get("parameters")*
call. And with that, is our single news page complete. We simply re-used all our
existing parts, and slightly modified them, and added our first controller. Lets
visit our news listing page, and click on a title of one entry. But before you do
that, it is advised you have at least two news inserted into the database table,
for testing purposes.
