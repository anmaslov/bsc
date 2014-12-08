class ProductImg < ActiveRecord::Base

  belongs_to :product, :class_name => "Product", :foreign_key => "product_id"

  has_attached_file :picture, styles: {:medium => "300x300#", :thumb => "150x150>", :thumbnail => "50x50>"}
  validates_attachment_content_type :picture, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  def picture_from_url (url)
    dd = URI.parse(url)
    req = Net::HTTP.new(dd.host, dd.port)
    res = req.request_head(dd.path)
    #code = res.code
    if res.code == "200"
      self.picture = URI.parse(url)
    end
  end

  include Rails.application.routes.url_helpers
  def to_jq_upload
    {
        "name" => read_attribute(:picture_file_name),
        "size" => read_attribute(:picture_file_size),
        "url" => picture.url(:original),
        "delete_url" => product_img_path(self),
        "delete_type" => "DELETE",
        "type" => "image/jpeg",
        "thumbnail_url" => picture.url(:thumbnail)
    }
  end

end
