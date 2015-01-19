class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_and_belongs_to_many :roles
  has_many :reports, :order => 'updated_at DESC'

  has_many :orders

  def role?(role)
    !!self.roles.find_by_name(role.to_s.camelize)
  end

  def reports_product
    Report.where(user_id: self.id, type_action: [Report.edit_save, Report.create_save], :created_at => (Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)).where.not(product_id: nil).all
  end

  #user.reports_product = Report.where(user_id: @user.id, type_action: [Report.edit_save, Report.create_save], :created_at => (Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)).where.not(product_id: nil).all

end
