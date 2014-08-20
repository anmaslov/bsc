class EmailBox < ActiveRecord::Base
  has_many :email
  belongs_to :supplier
end
