// Importa las bibliotecas necesarias
import React, { useState } from 'react';
import { Box, Icon, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

interface RatingProps {
  rating: number;
  ratingClick: (rating: number) => any;
}

export const Rating: React.FC<RatingProps> = ({ rating, ratingClick }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <Box>
      <Box>
        {[1, 2, 3, 4, 5].map((_, index) => {
          const starValue = index + 1;
          return (
            <Icon
              key={index}
              as={StarIcon}
              boxSize={6}
              color={
                starValue <= (hoverRating || rating || 0)
                  ? 'teal.500'
                  : 'gray.300'
              }
              cursor="pointer"
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => ratingClick(starValue)}
              _hover={{ color: 'teal.500' }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

