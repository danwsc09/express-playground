import { AppDataSource } from "./data-source";
import { Photo } from "./entity/Photo";
import { User } from "./entity/User";

AppDataSource.initialize()
  .then(async () => {
    const photoRepository = AppDataSource.getRepository(Photo);

    const photo = new Photo();
    photo.description = "bear drinking water";
    photo.filename = "bear";
    photo.isPublished = false;
    photo.name = "bear";
    photo.views = 3;

    await photoRepository.save(photo);
    console.log("photo saved with id:", photo.id);

    const justBear = await photoRepository.findOneBy({ name: "bear" });
    console.log(justBear);

    const firstPhoto = await photoRepository.findOne({ where: { id: 1 } });
    console.log("first:", firstPhoto);

    const allPublishedPhotos = await photoRepository.findBy({
      isPublished: true,
    });
    console.log("all pub:", allPublishedPhotos);

    const [, photosCount] = await photoRepository.findAndCount();
    console.log("count:", photosCount);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
