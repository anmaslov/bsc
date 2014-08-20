json.array!(@pages) do |page|
  json.extract! page, :id, :title, :description, :content, :keywords
  json.url page_url(page, format: :json)
end
