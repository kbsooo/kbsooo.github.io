# dario 🖊️

A minimal hugo theme inspired by Dario Amodei's personal [website](https://darioamodei.com/). It is designed to be as minimal, performant, and as elegant as possible for reading.

View the [live demo](https://log.birki.io) to see what it looks like ([source code](https://github.com/GrantBirki/dario)).

![home](https://raw.githubusercontent.com/GrantBirki/dario/main/docs/assets/home.png)

## Performance

This theme is designed to be minimal and the page speed insights are as follows:

![100](https://raw.githubusercontent.com/GrantBirki/dario/main/docs/assets/100.png)

## Installation

> To view a real example of a project using this theme, check out [grantbirki/log](https://github.com/GrantBirki/log) which is where I have the demo deployed.

Download the source of this repo (dario) as a zip from GitHub and extract in your themes directory at `<my_site>/themes/dario`.

Then, once you have the theme extracted, you can add it to your site's `config.toml`:

```toml
theme = "dario"
```

## Configuration

You can further configure how this site looks by editing your `config.toml` file. Here is an example of a configuration that works with this theme:

```toml
baseURL = "https://yoursite.com/"
languageCode = "en-us"
title = "log" # the title of your site

theme = "dario"

[params]
  author = "Your Name" # the author of the site
  description = "A description of your site" # a description of your site that will be used in the meta tags

  [params.homeInfoParams]
    Title = "Home Page Text" # the text to display on the "/" homepage
    Content = "This is a minimal web log inspired by Dario Amodei's personal [website](https://darioamodei.com/). Add some more text here that will be displayed on your homepage (you can use markdown)."
    Description = "A minimal web log." # The description of the home page that will be used in the open graph meta tags
```

## Blog Posts

Creating a blog post follows the same general process as most Hugo blogging themes.

Posts have markdown "front matter" that looks like this:

```yaml
---
title: "An Example Writing"
author: ["hugo", "monalisa"] # can be an array or just a string
description: "On how to write an example blog post"

# The summary is for search engines
summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.

date: 2000-01-01T00:00:00-00:00 # date of creation

draft: false

ogTitle: Cool New Example Post # the title of the post that will be used in the open graph meta tags
ogDescription: "An example of using the Dario hugo theme" # the description of the post that will be used in the open graph meta tags
ogImage: /posts/example/og.png # the path to a png/jpg image in the ./posts/example directory to use as the open graph image
---

Here is where you write the content of your blog post in markdown!
```

> Here is a [live example](https://github.com/GrantBirki/log/blob/0893a8488426d0f910feefe0c69c49f3c10fc8c8/content/posts/example/index.md) to view the source of a blog post that uses this theme.
