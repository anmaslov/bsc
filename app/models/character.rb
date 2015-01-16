class Character < ActiveRecord::Base

  belongs_to :product, :class_name => "Product", :foreign_key => "product_id"
  belongs_to :character_type, :class_name => "CharecterType", :foreign_key => "charecter_type_id"

end
