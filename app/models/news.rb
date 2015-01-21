class News < ActiveRecord::Base
  has_attached_file :image, :styles => { :medium => "250x140>", :thumb => "75x75#" }, :default_url => "/images/:style/missing.png"
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  has_many :sliders

  def news_type_title
    news_type == 0 ? 'blog' : 'video'
  end
end
