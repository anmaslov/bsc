json.array!(@news) do |news|
  json.extract! news, :id, :title, :type, :description, :content, :youtube_url
  json.url news_url(news, format: :json)
end
