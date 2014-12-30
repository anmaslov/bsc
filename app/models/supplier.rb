class Supplier < ActiveRecord::Base
  has_many :email
  has_many :product, :order => 'title ASC'

  has_many :prices

  belongs_to :email_box
  has_many :supplier_import_information
end
