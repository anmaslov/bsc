class OldCatalog < ActiveRecord::Base
  belongs_to :catalog
  belongs_to :product
end
