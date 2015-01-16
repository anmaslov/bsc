class CharactersController < ApplicationController
  before_action :set_character, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :index]

  # GET /characters
  # GET /characters.json
  def index
    #characters_uniq = Character.all.map(&:name).uniq
    #
    #characters_uniq.each do |ch|
    #  character_type = CharecterType.new
    #  character_type.name = ch
    #  character_type.save
    #
    #  characters_old = Character.where(name: ch)
    #  characters_old.each do |ch_old|
    #    ch_old.character_type_id = character_type.id
    #    ch_old.save
    #  end
    #
    #end

    @characters = Character.where(name: Character.all.map(&:name).uniq).order(:name).paginate(:page => params[:page], :per_page => 100)


  end

  # GET /characters/1
  # GET /characters/1.json
  def show
  end

  # GET /characters/new
  def new
    @character = Character.new
  end

  # GET /characters/1/edit
  def edit
  end

  # POST /characters
  # POST /characters.json
  def create
    @character = Character.new(character_params)

    respond_to do |format|
      if @character.save
        format.html { redirect_to @character, notice: 'Character was successfully created.' }
        format.json { render action: 'show', status: :created, location: @character }
      else
        format.html { render action: 'new' }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /characters/1
  # PATCH/PUT /characters/1.json
  def update
    respond_to do |format|
      if @character.update(character_params)
        format.html { redirect_to @character, notice: 'Character was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @character.destroy
    respond_to do |format|
      format.html { redirect_to characters_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_character
      @character = Character.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def character_params
      params[:character]
    end
end
