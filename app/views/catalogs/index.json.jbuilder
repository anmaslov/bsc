json.array!(@catalogs) do |catalog|
  json.extract! catalog, :id, :title, :description, :keywords, :content, :image_url, :parent_id
  json.url catalog_url(catalog, format: :json)
end
