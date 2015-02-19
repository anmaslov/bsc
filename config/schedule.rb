# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
set :environment, "production"
set :output, "/var/www/osetrov/data/www/osetrov.info/log/cron_log.log"
#set :job_template, "bash -l -i -c ':job'"
env :PATH, '/root/.rvm/environments/ruby-2.1.2@bsc'
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# every 1.hours do
#   runner "ReceiverPriceNotifier.receive_regual"
# end
#
# every 2.hours do
#   runner "Price.load_price_regual"
# end

# every 15.minute do
#   command "rvm use 2.1.2@bsc"
#   runner "ReceiverPriceNotifier.receive_regual"
# end

every 1.days, :at => '04:00am' do
  rake "ts:index RAILS_ENV=production"
  runner "Rails.cache.clear"
  runner "Product.re_cache"
  runner "Catalog.re_cache"
end

every [:monday, :tuesday, :wednesday, :thursday, :friday], :at => '21:00pm' do #1.minute do#
  command "rvm use 2.1.2@bsc"
  runner "ReportMailer.content_manager_for_the_day"
end

# Learn more: http://github.com/javan/whenever
