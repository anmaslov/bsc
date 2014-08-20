class Page < ActiveRecord::Base
  extend FriendlyId
  validates_presence_of :title, :url, :content

  friendly_id :url, use: [:slugged, :finders]

end
