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
      login: "/login"
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
      login: "/login"
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
      profile: "/profile"
    }
  );
}