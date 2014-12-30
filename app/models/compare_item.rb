class CompareItem < ActiveRecord::Base
  belongs_to :product
  has_many :characters, through: :product
  belongs_to :cart
end
