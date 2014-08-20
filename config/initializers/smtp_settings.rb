ActionMailer::Base.smtp_settings = {
    :address => "mail.bsc-ltd.ru",
    :port => 25,
    :authentication => :plain,
    :enable_starttls_auto => true,
    :user_name => "ordersystem@bsc-ltd.ru",
    :password => "H17fdfd71h",
    :openssl_verify_mode  => 'none'
}