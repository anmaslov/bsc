class Detail < ActiveRecord::Base
  belongs_to :detail_for, :class_name => "Product", :foreign_key => "detail_for_id"
  belongs_to :product
end
