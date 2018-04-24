/**
 * GET /home
 */
exports.index = (req, res, next) => {
  res.render('index', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      profile: "/profile",
      profile1: "/profile1",
      profile2: "/profile2",
      login: "/login",
      presentation: "/presentation"
    }
  );
}

exports.profile = (req, res, next) => {
  res.render('profile', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      index: "/",
      login: "/login",
      presentation: "/presentation",
      profile1: "/profile1",
      profile2: "/profile2"
    }
  );
}

exports.profile1 = (req, res, next) => {
  res.render('profile1', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      index: "/",
      login: "/login",
      presentation: "/presentation",
      profile: "/profile",
      profile2: "/profile2"
    }
  );
}

exports.profile2 = (req, res, next) => {
  res.render('profile2', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      index: "/",
      login: "/login",
      presentation: "/presentation",
      profile1: "/profile1",
      profile: "/profile"
    }
  );
}

exports.login = (req, res, next) => {
  res.render('login', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      index: "/",
      profile: "/profile",
      presentation: "/presentation",
      profile1: "/profile1",
      profile2: "/profile2"
    }
  );
}

exports.presentation = (req, res, next) => {
  res.render('presentation', {
      production_mode: process.env.DEVELOPMENT == 'true',
      title: res.__('title'),
      keywords: res.__('keywords'),
      description:res.__('description'),
      ui_title: res.__('title'),
      ui_subtitle: res.__('soon_title'),
      ui_description: res.__('soon_subtitle'),
      ui_soon: res.__('soon_text'),
      index: "/",
      profile: "/profile",
      login: "/login",
      profile1: "/profile1",
      profile2: "/profile2"
    }
  );
}