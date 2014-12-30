class ReportMailer < ActionMailer::Base
  default from: "report@bsc-ltd.ru"
#CwVW7gzhxgMy3ied
  def content_manager_for_the_day

    @users = User.where('id IN (SELECT DISTINCT(user_id) FROM roles_users WHERE role_id = 2)').all
    @admins = User.where('id IN (SELECT DISTINCT(user_id) FROM roles_users WHERE role_id = 1)').all
    emails = ''
    @admins.each do |admin|
      emails = emails + admin.email + ','
    end


    #emails = 'paulos@mail.ru'

    mail(to: emails, subject: 'Отчет по контент-менеджерам').deliver
  end

end
