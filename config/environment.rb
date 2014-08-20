# Load the Rails application.
ENV['RAILS_ENV'] ||= 'production'
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Bsc::Application.initialize!

ActionMailer::Base.delivery_method = :smtp