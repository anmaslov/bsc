class Supplier < ActiveRecord::Base
  has_many :email
  has_many :product, :order => 'title ASC'
  belongs_to :email_box
  belongs_to :supplier_import_information
end
