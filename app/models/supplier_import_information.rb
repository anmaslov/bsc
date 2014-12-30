class SupplierImportInformation < ActiveRecord::Base
  belongs_to :supplier
  has_many :prices
end
