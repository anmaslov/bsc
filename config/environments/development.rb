Bsc::Application.configure do
  config.action_mailer.default_url_options = { :host => 'localhost:3000' }
  config.action_mailer.delivery_method = :smtp

  config.action_mailer.smtp_settings = {
      address:              "mail.bsc-ltd.ru",
      port:                 25,
      authentication:       "plain",
      user_name:            "ordersystem@bsc-ltd.ru",
      password:             "H17fdfd71h",
      :openssl_verify_mode  => 'none'
  }


  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false
  config.force_ssl
  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true
  config.assets.precompile =  ['*.js', '*.css', '*.css.erb']
  config.assets.precompile += [/^[a-z0-9]\w+\.(css|js)$/]

  $ROOT_PATH = '/home/osetrov/RubymineProjects/bsc/'
  $PUBLIC_PATH = '/home/osetrov/RubymineProjects/bsc/public'
  $GC_ID = 20
  $shopPassword = 'IsfdkcCS42WKF1pDyOu'

  #$GC_ID = 777
  #$ROOT_PATH = '/var/www/osetrov/data/www/osetrov.info/'
end
