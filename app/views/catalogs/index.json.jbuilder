json.array!(@catalogs) do |catalog|
  json.extract! catalog, :id, :title, :parent_id, :childrens
  json.url catalog_url(catalog, format: :json)
end
