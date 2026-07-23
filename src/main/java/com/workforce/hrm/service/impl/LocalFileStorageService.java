package com.workforce.hrm.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.exception.FileStorageException;
import com.workforce.hrm.service.FileStorageService;

@Service
public class LocalFileStorageService implements FileStorageService {

	private final Path fileStorageLocation;

	public LocalFileStorageService(@Value("${file.upload-dir}") String uploadDir) {

		this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (IOException ex) {
			throw new FileStorageException("Could not create upload directory.", ex);
		}
	}

	@Override
	public String storeFile(MultipartFile file) {

		String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

		String extension = "";

		int dotIndex = originalFileName.lastIndexOf(".");

		if (dotIndex != -1) {
			extension = originalFileName.substring(dotIndex);
		}

		String fileName = UUID.randomUUID() + extension;

		try {

			if (originalFileName.contains("..")) {
				throw new FileStorageException("Invalid file name.");
			}

			Path targetLocation = this.fileStorageLocation.resolve(fileName);

			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

			return fileName;

		} catch (IOException ex) {
			throw new FileStorageException("Could not store file.", ex);
		}
	}

	@Override
	public Resource loadFile(String fileName) {

		try {

			Path filePath = fileStorageLocation.resolve(fileName).normalize();

			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists()) {
				return resource;
			}

			throw new FileStorageException("File not found.");

		} catch (MalformedURLException ex) {

			throw new FileStorageException("File not found.", ex);

		}

	}

	@Override
	public void deleteFile(String fileName) {

		try {

			Path filePath = fileStorageLocation.resolve(fileName).normalize();

			Files.deleteIfExists(filePath);

		} catch (IOException ex) {

			throw new FileStorageException("Could not delete file.", ex);

		}

	}

}